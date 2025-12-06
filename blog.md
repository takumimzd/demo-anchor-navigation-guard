# aタグでの画面遷移に離脱防止ダイアログを実装する

## はじめに

フォームに入力した内容があるのに、うっかり別のページに遷移してしまい、入力内容が消えてしまった...という経験は誰しもあるのではないでしょうか。

このような事故を防ぐために、画面遷移時に「入力内容が保存されません。移動してもよろしいですか？」といった確認ダイアログを表示することがあります。

ブラウザ標準の`beforeunload`イベントを使えば、タブを閉じたりリロードしたりする際に確認ダイアログを表示できます。しかし、このダイアログはブラウザが提供するもので、見た目をカスタマイズすることができません。

サービスの世界観に合わせたデザインのダイアログを表示したい、という要件がある場合、独自の実装が必要になります。

## フレームワーク標準の機能を使えない問題

React Router、TanStack Router、Next.jsなどのSPAフレームワークを使っている場合、ナビゲーションガードの機能が標準で提供されています。

### React Router の場合

```tsx
import { useBlocker } from 'react-router-dom'

const blocker = useBlocker(
  ({ currentLocation, nextLocation }) =>
    isDirty && currentLocation.pathname !== nextLocation.pathname
)
```

### TanStack Router の場合

```tsx
import { useBlocker } from '@tanstack/react-router'

useBlocker({
  blockerFn: () => window.confirm('このページを離れますか？'),
  condition: isDirty,
})
```

### Next.js の場合

```tsx
import { useRouter } from 'next/router'

useEffect(() => {
  const handleRouteChange = (url: string) => {
    if (isDirty && !window.confirm('このページを離れますか？')) {
      router.events.emit('routeChangeError')
      throw 'routeChange aborted'
    }
  }
  router.events.on('routeChangeStart', handleRouteChange)
  return () => router.events.off('routeChangeStart', handleRouteChange)
}, [isDirty])
```

しかし、私が開発しているサービスでは**Railsがルーティングを担当しており**、フロントエンドはReactでUIを構築しているものの、ページ遷移は全てハードナビゲーション（通常の`<a>`タグによる遷移）で行われています。

このような構成では、上記のSPAフレームワークが提供するナビゲーションガード機能を使うことができません。そこで、`<a>`タグのクリックイベントをキャプチャして、独自の確認ダイアログを表示する仕組みを実装しました。

## useAnchorNavigationGuard の実装

### 全体のコード

```tsx
import { useCallback, useEffect, useState } from 'react'

type NavigationAction = {
  execute: () => void
}

type Args = {
  active: boolean
}

export const useAnchorNavigationGuard = ({ active }: Args) => {
  // ブロックしたアクションを一時的に保持するためのstate
  const [pendingNavigation, setPendingNavigation] = useState<NavigationAction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // ダイアログのOKボタンを押した時の処理
  const handleConfirm = useCallback(() => {
    if (!pendingNavigation) return
    pendingNavigation.execute()
    setPendingNavigation(null)
    setIsDialogOpen(false)
  }, [pendingNavigation])

  // ダイアログのキャンセルボタンを押した時の処理
  const handleCancel = useCallback(() => {
    setIsDialogOpen(false)
    setPendingNavigation(null)
  }, [])

  // aタグ遷移のガード
  useEffect(() => {
    if (!active) return

    const handleClick = (e: MouseEvent) => {
      // すでに他のイベントでpreventDefaultが呼び出されている場合は何もしない
      if (e.defaultPrevented) return

      // 右クリック、Command+クリック、Ctrl+クリックは制御しない
      if (e.button !== 0 || e.metaKey || e.ctrlKey) return

      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]')
      if (!anchor) return

      // ダウンロードの場合は制御しない
      if (anchor.getAttribute('download') !== null) return

      // 別タブで開く場合は制御しない
      if (anchor.getAttribute('target') === '_blank') return

      const href = anchor.getAttribute('href')!

      // デフォルトの処理をブロック
      e.preventDefault()
      e.stopPropagation()

      // 遷移アクションを保持してダイアログを表示
      setPendingNavigation({
        execute: () => {
          window.location.href = href
        },
      })
      setIsDialogOpen(true)
    }

    window.addEventListener('click', handleClick, true)
    return () => window.removeEventListener('click', handleClick, true)
  }, [active])

  return {
    isOpen: isDialogOpen,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  }
}
```

### 実装のポイント

#### 1. キャプチャフェーズでイベントをリッスンする

```tsx
window.addEventListener('click', handleClick, true) // 第3引数のtrueがポイント
```

`addEventListener`の第3引数に`true`を渡すことで、**キャプチャフェーズ**でイベントをリッスンしています。

通常のイベントリスナー（バブリングフェーズ）では、他のクリックハンドラが先に実行される可能性があります。キャプチャフェーズで処理することで、`<a>`タグのクリックイベントを**最優先**でキャッチできます。

#### 2. 制御すべきでないクリックを除外する

```tsx
// 右クリック、Command+クリック、Ctrl+クリックは制御しない
if (e.button !== 0 || e.metaKey || e.ctrlKey) return

// ダウンロードの場合は制御しない
if (anchor.getAttribute('download') !== null) return

// 別タブで開く場合は制御しない
if (anchor.getAttribute('target') === '_blank') return
```

以下のケースは、ユーザーが意図的に「現在のページを離れずに」操作しようとしているため、ガードの対象外としています。

- **右クリック**: コンテキストメニューを表示したいだけ
- **Command/Ctrl + クリック**: 新しいタブで開きたい
- **ダウンロードリンク**: ファイルをダウンロードするだけで遷移しない
- **`target="_blank"`**: 別タブで開くため、現在のページは離れない

#### 3. 遷移アクションを保持してからダイアログを表示する

```tsx
setPendingNavigation({
  execute: () => {
    window.location.href = href
  },
})
setIsDialogOpen(true)
```

遷移先の`href`をクロージャでキャプチャした`execute`関数を保持しておきます。ユーザーが確認ダイアログで「移動する」を選択した場合、この`execute`関数を呼び出すことで遷移を実行します。

#### 4. 確認ダイアログでの処理

```tsx
const handleConfirm = useCallback(() => {
  if (!pendingNavigation) return
  pendingNavigation.execute() // 保持していた遷移を実行
  setPendingNavigation(null)
  setIsDialogOpen(false)
}, [pendingNavigation])

const handleCancel = useCallback(() => {
  setIsDialogOpen(false)
  setPendingNavigation(null) // 遷移をキャンセル
}, [])
```

- **確認時（`handleConfirm`）**: 保持していた遷移アクションを実行し、状態をリセット
- **キャンセル時（`handleCancel`）**: 遷移は実行せず、状態をリセット

### 使い方

```tsx
function App() {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const isDirty = Object.values(formData).some((value) => value.trim() !== '')

  const { isOpen, onConfirm, onCancel } = useAnchorNavigationGuard({
    active: isDirty, // フォームに入力がある場合のみガードを有効化
  })

  return (
    <>
      <form>{/* フォームの内容 */}</form>
      <a href="/other-page">他のページへ</a>
      <ConfirmDialog isOpen={isOpen} onConfirm={onConfirm} onCancel={onCancel} />
    </>
  )
}
```

`active`プロパティを使って、フォームに入力がある場合のみガードを有効にするといった制御が可能です。

## 注意点・制限事項

この実装にはいくつかの制限があります。

### 1. ブラウザの戻る/進むボタンには対応できない

`<a>`タグのクリックをキャプチャしているため、ブラウザの戻る/進むボタンによる遷移は検知できません。これを防ぐには別途`beforeunload`イベントや`popstate`イベントのハンドリングが必要です。

### 2. タブを閉じる操作には対応できない

同様に、タブを閉じる操作に対しては`beforeunload`イベントを使う必要があります。

```tsx
useEffect(() => {
  if (!isDirty) return

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault()
    e.returnValue = '' // 一部のブラウザで必要
  }

  window.addEventListener('beforeunload', handleBeforeUnload)
  return () => window.removeEventListener('beforeunload', handleBeforeUnload)
}, [isDirty])
```

ただし、`beforeunload`で表示されるダイアログはブラウザ標準のものになり、カスタムのダイアログは表示できません。

## おわりに

Railsなどのサーバーサイドがルーティングを担当している環境でも、`<a>`タグのクリックイベントをキャプチャすることで、独自の離脱防止ダイアログを実装できることを紹介しました。

ポイントをまとめると：

- **キャプチャフェーズ**でイベントをリッスンすることで、確実に`<a>`タグのクリックをキャッチ
- **右クリック、Command/Ctrl+クリック、別タブで開くリンク**など、ガード不要なケースを適切に除外
- **遷移アクションを保持**しておき、ユーザーの確認後に実行する仕組み
- **HTMLの`<dialog>`要素**を使うことで、アクセシビリティを考慮した実装が可能

SPAフレームワークの便利な機能が使えない環境でも、ちょっとした工夫でUXを向上させることができます。同じような課題を抱えている方の参考になれば幸いです。


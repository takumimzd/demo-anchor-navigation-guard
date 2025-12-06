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

    // ブロックしていたアクションを継続する
    pendingNavigation.execute()

    // ブロックしていたアクションは実行されたので、初期値に戻す
    setPendingNavigation(null)

    setIsDialogOpen(false)
  }, [pendingNavigation])

  // ダイアログのキャンセルボタンを押した時の処理
  const handleCancel = useCallback(() => {
    setIsDialogOpen(false)

    // ブロックしていたアクションは実行されなかったので、初期値に戻す
    setPendingNavigation(null)
  }, [])

  // aタグ遷移のガード
  useEffect(() => {
    if (!active) return

    const handleClick = (e: MouseEvent) => {
      // すでに他のイベントでpreventDefaultが呼び出されている場合は何もしない
      const isEventAlreadyPrevented = e.defaultPrevented
      if (isEventAlreadyPrevented) return

      const isRightClick = e.button !== 0 // 右クリック
      const isMetaKeyPressed = e.metaKey // Command(macOS)
      const isControlKeyPressed = e.ctrlKey // Ctrl(Windows/Linux)

      // 特定のキーボード操作は制御しない
      if (isRightClick || isMetaKeyPressed || isControlKeyPressed) return

      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]')
      if (!anchor) return

      // ダウンロードの場合は制御しない
      const href = anchor.getAttribute('href')!
      if (anchor.getAttribute('download') !== null) return

      // 別タブで開く場合は制御しない
      if (anchor.getAttribute('target') === '_blank') return

      // デフォルトの処理をブロックする
      e.preventDefault()
      e.stopPropagation()

      // ダイアログ内の処理で使用するためのactionを保持する
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

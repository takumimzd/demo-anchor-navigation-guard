import { useState } from 'react'
import { useAnchorNavigationGuard } from './hooks/useAnchorNavigationGuard'
import { ConfirmDialog } from './components/ConfirmDialog'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  // フォームに何か入力されているかどうか
  const isDirty = Object.values(formData).some((value) => value.trim() !== '')

  const { isOpen, onConfirm, onCancel } = useAnchorNavigationGuard({
    active: isDirty,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] px-6 py-15 font-sans">
      {/* ヘッダー */}
      <header className="mb-15 text-center">
        <h1 className="mb-4 bg-linear-to-r from-[#f093fb] via-[#f5576c] to-[#4facfe] bg-clip-text text-[clamp(28px,5vw,42px)] font-bold tracking-tight text-transparent">
          Navigation Guard Demo
        </h1>
        <p className="mx-auto max-w-[500px] text-base leading-relaxed text-[#8888a0]">
          フォームに入力した状態でリンクをクリックすると確認ダイアログが表示されます
        </p>
      </header>

      {/* フォーム */}
      <div className="mx-auto mb-12 max-w-[500px] rounded-2xl border border-[#3a3a50] bg-linear-to-br from-[#1e1e30] to-[#252540] p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">お問い合わせフォーム</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
              isDirty
                ? 'bg-[#f5576c]/20 text-[#f5576c]'
                : 'bg-[#3a3a50] text-[#6b7280]'
            }`}
          >
            {isDirty ? '未保存の変更あり' : '変更なし'}
          </span>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#a0a0b0]"
            >
              お名前
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="山田 太郎"
              className="w-full rounded-xl border border-[#3a3a50] bg-[#1a1a2e] px-4 py-3 text-sm text-white placeholder-[#5a5a70] outline-none transition-all duration-200 focus:border-[#f093fb]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#a0a0b0]"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full rounded-xl border border-[#3a3a50] bg-[#1a1a2e] px-4 py-3 text-sm text-white placeholder-[#5a5a70] outline-none transition-all duration-200 focus:border-[#f093fb]"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-[#a0a0b0]"
            >
              メッセージ
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="お問い合わせ内容を入力してください"
              rows={4}
              className="w-full resize-none rounded-xl border border-[#3a3a50] bg-[#1a1a2e] px-4 py-3 text-sm text-white placeholder-[#5a5a70] outline-none transition-all duration-200 focus:border-[#f093fb]"
            />
          </div>
        </div>
      </div>

      {/* リンクカード */}
      <div className="mx-auto grid max-w-[900px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {/* GitHub */}
        <a
          href="https://github.com"
          className="group block rounded-[20px] border border-[#3a3a50] bg-linear-to-br from-[#1e1e30] to-[#252540] p-8 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[#6366f1] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        >
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-[#6366f1] to-[#8b5cf6]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">GitHub</h3>
          <p className="text-sm leading-relaxed text-[#8888a0]">
            世界最大のコードホスティングサービス
          </p>
        </a>

        {/* React */}
        <a
          href="https://react.dev"
          className="group block rounded-[20px] border border-[#3a3a50] bg-linear-to-br from-[#1e1e30] to-[#252540] p-8 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[#61dafb] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        >
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-[#61dafb] to-[#4fc3f7]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a1a2e">
              <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">React</h3>
          <p className="text-sm leading-relaxed text-[#8888a0]">
            UIを構築するためのJavaScriptライブラリ
          </p>
        </a>

        {/* TypeScript */}
        <a
          href="https://www.typescriptlang.org"
          className="group block rounded-[20px] border border-[#3a3a50] bg-linear-to-br from-[#1e1e30] to-[#252540] p-8 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[#3178c6] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        >
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-[#3178c6] to-[#235a97]">
            <span className="text-lg font-bold text-white">TS</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">TypeScript</h3>
          <p className="text-sm leading-relaxed text-[#8888a0]">
            JavaScriptに型を追加した言語
          </p>
        </a>

        {/* Vite - 別タブで開く */}
        <a
          href="https://vite.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block rounded-[20px] border border-[#3a3a50] bg-linear-to-br from-[#1e1e30] to-[#252540] p-8 no-underline transition-all duration-300 hover:-translate-y-1 hover:border-[#bd34fe] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        >
          {/* 別タブバッジ */}
          <span className="absolute top-4 right-4 rounded-full bg-[#22c55e]/20 px-2.5 py-1 text-xs font-medium text-[#22c55e]">
            別タブで開く
          </span>
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-[#bd34fe] to-[#41d1ff]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.4 2.7L21.7 4.5L12 22L2.3 4.5L12.4 2.7Z" fill="#41D1FF" />
              <path d="M12.4 2.7L21.7 4.5L12 22L12.4 2.7Z" fill="#BD34FE" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">Vite</h3>
          <p className="text-sm leading-relaxed text-[#8888a0]">
            次世代フロントエンドツール（確認なしで開きます）
          </p>
        </a>
      </div>

      {/* フッター */}
      <footer className="mt-20 text-center text-[13px] text-[#5a5a70]">
        <p>フォームに入力した状態でリンクをクリックしてみてください</p>
      </footer>

      {/* 確認ダイアログ */}
      <ConfirmDialog isOpen={isOpen} onConfirm={onConfirm} onCancel={onCancel} />
    </div>
  )
}

export default App

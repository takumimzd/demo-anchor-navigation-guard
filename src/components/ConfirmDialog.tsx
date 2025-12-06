import { useEffect, useRef } from 'react'

type Props = {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({ isOpen, onConfirm, onCancel }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [isOpen])

  // ESCキーでダイアログが閉じられた時の処理
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault()
    onCancel()
  }

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      className="fixed inset-0 m-auto w-[90%] max-w-[420px] overflow-hidden rounded-2xl border-none bg-[#1a1a2e] p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-[slideIn_0.2s_ease-out]"
    >
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <div className="p-8">
        {/* アイコン */}
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-linear-to-br from-[#f093fb] to-[#f5576c]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        {/* タイトル */}
        <h2 className="mb-3 text-center text-xl font-semibold text-white">
          ページを離れますか？
        </h2>

        {/* 説明文 */}
        <p className="text-center text-sm leading-relaxed text-[#a0a0b0]">
          入力した内容は保存されません。
          <br />
          このまま移動してもよろしいですか？
        </p>
      </div>

      {/* ボタンエリア */}
      <div className="flex gap-3 px-8 pb-8">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 cursor-pointer rounded-[10px] border border-[#3a3a50] bg-[#2a2a40] px-6 py-3.5 text-sm font-medium text-white transition-all duration-150 hover:bg-[#3a3a50]"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 cursor-pointer rounded-[10px] border-none bg-linear-to-br from-[#f093fb] to-[#f5576c] px-6 py-3.5 text-sm font-medium text-white transition-all duration-150 hover:-translate-y-0.5 hover:opacity-90"
        >
          移動する
        </button>
      </div>
    </dialog>
  )
}

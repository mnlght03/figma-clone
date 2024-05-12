import CursorSVG from '@/public/assets/CursorSVG';
import { CursorChatProps, CursorMode } from '@/types/type';

const CursorChat = ({
  cursor,
  cursorState,
  setCursorState,
  updateMyPresence,
}: CursorChatProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;

    updateMyPresence({ message: newMessage });

    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: newMessage,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCursorState({
        mode: CursorMode.Chat,
        previousMessage: cursorState.message,
        message: '',
      });
    } else if (e.key === 'Escape') {
      setCursorState({
        mode: CursorMode.Hidden,
      });
    }
  };

  return (
    <div
      className='absolute left-0 top-0'
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
    >
      {cursorState.mode === CursorMode.Chat && (
        <>
          <CursorSVG color='#000' />
          <div
            className='absolute left-2 top-5 rounded-[20px] bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white'
            onKeyUp={(e) => e.stopPropagation()}
          >
            {cursorState.previousMessage && (
              <div> {cursorState.previousMessage}</div>
            )}

            <input
              type='text'
              className='z-10 w-60 border-none bg-transparent text-white placeholder-blue-300 outline-none placeholder:select-none'
              autoFocus={true}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={
                cursorState.previousMessage ? '' : 'Type a message...'
              }
              maxLength={50}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CursorChat;

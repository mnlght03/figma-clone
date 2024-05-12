import CursorChat from '@/components/cursor/CursorChat';
import LiveCursors from './cursor/LiveCursors';
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from '@/liveblocks.config';
import { useCallback, useEffect, useState } from 'react';
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type';
import ReactionSelector from '@/components/reaction/ReactionButton';
import FlyingReaction from '@/components/reaction/FlyingReaction';
import useInterval from '@/hooks/useInterval';

const REACTION_SHOW_INTERVAL = 100;

const REACTION_EXPIRE_TIME = 4000;

const REACTION_PURGE_INTERVAL = 1000;

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};

const Live = ({ canvasRef }: Props) => {
  const others = useOthers();

  const [{ cursor }, updateMyPresence] = useMyPresence() as any;

  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();

    if (cursor != null && cursorState.mode === CursorMode.ReactionSelector) {
      return;
    }

    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;

    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x, y } });
  }, []);

  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    setCursorState({ mode: CursorMode.Hidden });

    updateMyPresence({ cursor: null, message: null });
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;

    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x, y } });

    setCursorState((state: CursorState) =>
      cursorState.mode === CursorMode.Reaction
        ? { ...state, isPressed: true }
        : state
    );
  }, []);

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state
      );
    },
    [cursorState.mode, setCursorState]
  );

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === '/' || e.key.toLocaleLowerCase() === 'c') {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: '',
        });
      } else if (e.key === 'Escape') {
        updateMyPresence({ message: '' });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === 'e') {
        setCursorState({
          mode: CursorMode.ReactionSelector,
        });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
      }
    };

    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [updateMyPresence]);

  const [reactions, setReactions] = useState<Reaction[]>([]);

  const broadcast = useBroadcastEvent();

  useInterval(() => {
    const currentTimestamp = Date.now();

    setReactions((reactions) =>
      reactions.filter(
        (r) => r.timestamp > currentTimestamp - REACTION_EXPIRE_TIME
      )
    );
  }, REACTION_PURGE_INTERVAL);

  useInterval(() => {
    if (
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed &&
      cursor
    ) {
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])
      );

      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, REACTION_SHOW_INTERVAL);

  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;

    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });

  const setReaction = useCallback((reaction: string) => {
    setCursorState({
      mode: CursorMode.Reaction,
      reaction,
      isPressed: false,
    });
  }, []);

  return (
    <div
      id='canvas'
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
      className='flex h-screen w-full items-center justify-center border-2 border-green-500 text-center'
    >
      <canvas ref={canvasRef} />

      {reactions.map((reaction) => (
        <FlyingReaction
          key={reaction.timestamp.toString()}
          x={reaction.point.x}
          y={reaction.point.y}
          timestamp={reaction.timestamp}
          value={reaction.value}
        />
      ))}

      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector setReaction={setReaction} />
      )}

      <LiveCursors others={others} />
    </div>
  );
};

export default Live;

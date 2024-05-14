'use client';

import LeftSidebar from '@/components/LeftSidebar';
import Live from '@/components/Live';
import Navbar from '@/components/Navbar';
import RightSidebar from '@/components/RightSidebar';

import {
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
} from '@/lib/canvas';

import { useEffect, useRef, useState } from 'react';

import { fabric } from 'fabric';
import { ActiveElement } from '@/types/type';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fabricRef = useRef<fabric.Canvas | null>(null);

  const isDrawing = useRef<boolean>(false);

  const shapeRef = useRef<fabric.Object | null>(null);

  const selectedShapeRef = useRef<string | null>('rectangle');

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value: '',
    icon: '',
  });

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);

    selectedShapeRef.current = elem?.value as string;
  };

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on('mouse:down', (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
    });

    const handleResizeEvent = () => {
      handleResize({ canvas: fabricRef.current });
    };

    window.addEventListener('resize', handleResizeEvent);

    return () => {
      canvas.dispose();

      window.removeEventListener('resize', handleResizeEvent);
    };
  }, []);

  return (
    <main className='h-screen overflow-hidden'>
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
      />

      <section className='flex h-full'>
        <LeftSidebar />

        <Live canvasRef={canvasRef} />

        <RightSidebar />
      </section>
    </main>
  );
}

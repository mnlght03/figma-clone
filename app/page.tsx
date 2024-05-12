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
import { useEffect, useRef } from 'react';

import { fabric } from 'fabric';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fabricRef = useRef<fabric.Canvas | null>(null);

  const isDrawing = useRef<boolean>(false);

  const shapeRef = useRef<fabric.Object | null>(null);

  const selectedShapeRef = useRef<string | null>('rectangle');

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

    window.addEventListener('resize', () => {
      handleResize({ canvas: fabricRef.current });
    });

    return () => {
      canvas.dispose();

      window.removeEventListener('reise', () =>
        handleResize({
          canvas: null,
        })
      );
    };
  }, []);

  return (
    <main className='h-screen overflow-hidden'>
      <Navbar />

      <section className='flex h-full'>
        <LeftSidebar />

        <Live canvasRef={canvasRef} />

        <RightSidebar />
      </section>
    </main>
  );
}

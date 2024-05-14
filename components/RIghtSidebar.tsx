import { fabric } from 'fabric';
import { RightSidebarProps } from '@/types/type';
import Color from './settings/Color';
import Dimensions from './settings/Dimensions';
import Export from './settings/Export';
import Text from './settings/Text';
import { modifyShape } from '@/lib/shapes';
import { useRef } from 'react';

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  isEditingRef,
  activeObjectRef,
  syncShapeInStorage,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = (property: string, value: string) => {
    isEditingRef.current = true;

    setElementAttributes((prev) => ({
      ...prev,
      [property]: value,
    }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    });
  };

  return (
    <section className='border-primary-gray-200 sticky right-0 flex h-full min-w-[227px] select-none flex-col border-t bg-primary-black text-primary-grey-300 max-sm:hidden'>
      <h3 className='text-sx px-5 pt-4 uppercase'>Design</h3>

      <span className='borer-pirmary-grey-200 mt-3 border-b px-5 pb-4 text-xs text-primary-grey-300'>
        Make changes to canvas
      </span>

      <Dimensions
        width={elementAttributes.width}
        height={elementAttributes.height}
        handleInputChange={handleInputChange}
        isEditingRef={isEditingRef}
      />

      <Text
        fontFamily={elementAttributes.fontFamily}
        fontSize={elementAttributes.fontSize}
        fontWeight={elementAttributes.fontWeight}
        handleInputChange={handleInputChange}
      />
      <Color
        inputRef={colorInputRef}
        attribute={elementAttributes.fill}
        attributeType='fill'
        placeholder='color'
        handleInputChange={handleInputChange}
      />
      <Color
        inputRef={colorInputRef}
        attribute={elementAttributes.stroke}
        attributeType='stroke'
        placeholder='stroke'
        handleInputChange={handleInputChange}
      />
      <Export />
    </section>
  );
};

export default RightSidebar;

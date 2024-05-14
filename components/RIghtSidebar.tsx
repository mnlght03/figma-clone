import Color from './settings/Color';
import Dimensions from './settings/Dimensions';
import Export from './settings/Export';
import Text from './settings/Text';

const RightSidebar = () => {
  return (
    <section className='border-primary-gray-200 sticky right-0 flex h-full min-w-[227px] select-none flex-col border-t bg-primary-black text-primary-grey-300 max-sm:hidden'>
      <h3 className='text-sx px-5 pt-4 uppercase'>Design</h3>
      <span>Make changes to canvas</span>

      <Dimensions />
      <Text />
      <Color />
      <Color />
      <Export />
    </section>
  );
};

export default RightSidebar;

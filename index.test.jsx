import React from 'react';
import { shallow } from 'enzyme';
import ChildWindow from './';

describe(ChildWindow, () => {
  test('always mounts null', () => {
    const wrapper = shallow(<ChildWindow />);

    expect(wrapper.node).toEqual(null);
  });
});
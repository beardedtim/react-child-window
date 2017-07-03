/* eslint-disable */
import React, { Component } from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import R from 'ramda';

// https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Window_features
const defaultWindowOptions = [
  'about:blank',
  'My Awesome Title',
  'toolbar=false',
  'menubar=false',
];

const PopoutWrapper = ({ children }) => (
  <div>
    {children}
  </div>
);

class ChildWindow extends Component {
  static displayName = 'ChildWindow'
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string),
    open: PropTypes.bool,
    onUnload: PropTypes.func,
    onLoad: PropTypes.func,
    mountID: PropTypes.string,
  }

  constructor(props) {
    super(props);
    const defaultRef = (el) => console.dir(el);
    this.setRef = props.setRef || defaultRef;
  }

  componentWillMount = () => (
    this.props.open
      ? this.openWindow(this.props)
      : this.closeWindow()
  )

  componentWillReceiveProps = (props) => {
    const { open } = props;

    if (open) {
      this.openWindow(props);
    } else {
      this.closeWindow();
    }
  }

  componentWillUnmount = () => this.closeWindow()

  getChildMountElement = (id, win) => {
    const alreadyMounted = win.document.getElementById(id);

    if (alreadyMounted) {
      return alreadyMounted;
    }

    const el = win.document.createElement('div');

    el.setAttribute('id', id);

    win.document.body.appendChild(el);

    this.setRef(el);

    return el;
  }

  withSplitScreen = (options, win) => {
    if (!win) {
      return options;
    }

    return [...options];
  }

  openWindow = (props) => {
    if (this.childWindow) {
      return this.renderToChild(this.updateChildren(props));
    }

    const parentWindow = props.window || window;

    if (!parentWindow) {
      return null;
    }

    const { options = defaultWindowOptions } = props;

    this.childWindow = this.createChild(
      this.withSplitScreen(options, parentWindow),
      parentWindow
    );

    return this.childWindow;
  }

  createChild = ([url, title, ...attrs], win) => {
    const childWindow = win.open(url, title, attrs.join(','));
    // eslint-disable-next-line 
    const defaultHandleUnload = (event, self) => self.childWindow = null;
    const defaultHandleLoad = () => console.log('The content has loaded');

    const {
      onUnload = defaultHandleUnload,
      onLoad = defaultHandleLoad,
      mountID = 'mount',
    } = this.props;

    const mountElement = this.getChildMountElement(mountID, childWindow);
    const renderToChild = comp => render(comp, mountElement);

    this.renderToChild = R.ifElse(
      R.is(Array),
      comp => renderToChild(<PopoutWrapper>{comp}</PopoutWrapper>),
      renderToChild
    );

    /**
     * window.componentDidMount
     */
    childWindow.addEventListener(
      'load',
      event => onLoad(event, this)
    );

    /**
     * window.componentWillUnmount
     */
    childWindow.addEventListener(
      'beforeunload',
      event => onUnload(event, this)
    );

    this.renderToChild(this.updateChildren(this.props));

    return childWindow;
  }

  closeWindow = () => this.childWindow && this.childWindow.close()

  updateChildren = ({ children, onLoad, onUnload, ...props }) => React.Children
  .map(
    children,
    child => React.cloneElement(child, props)
  )

  render = () => null
}

export default ChildWindow;

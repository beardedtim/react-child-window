# react-child-window

> Sweet child o' miiiiiine

## Usage

```
import ChildWindow from 'react-child-window';

class App extends Component {
  state = {
    opened: false,
  }

  toggleChild = () => this.setState(({ opened }) => ({ opened: !opened }))

  render() {
    return (
      <div>
        <button onClick={this.toggleChild}>
          Open Child Window
        </button>
        <ChildWindow open={this.state.opened}>
          <h2>I will be rendered in the child window!</h2>
          <User name="Tim" profile={ { these: 'will be merged with ChildWindow props' }}/>
        </ChildWindow>
      </div>
    )
  }
}

export default App;
```
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
React Component 是所有交互类的基类。
*/
class Square extends React.Component {
  /* 构造函数。 props是外界传入的属性，对外开放。 */ 
  constructor(props){
    /* 初始化父类方法 */
    super(props); 
    /* state 是每一个类都具有的私有状态变量，可以添加自定义数据。 */ 
    this.state = {
      value: null,
    };
  }

  /* 渲染方法，告诉浏览器应该显示什么样的页面。 */
  render() {
    return (
      <button className="square" onClick={()=> this.props.onClick() }>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      squares : Array(9).fill(null),
      xIsNext: true,
    };
  }

  renderSquare(i) {
    return <Square value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
    />;
  }
  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function   calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history : [{
        squares : Array(9).fill(null),
      }],
      stepNum: 0,
      xIsNext : true,
    };
  }
  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNum + 2);
    const current = history[this.state.stepNum];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({history : history.concat([{
      squares : squares,
    }]), 
    stepNum : history.length,
    xIsNext : !this.state.xIsNext});

  }

  jumpTo(step){
    this.setState({
      stepNum : step,
      xIsNext : (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNum];
    const winner = calculateWinner(current.squares);

    const moves = history.map( (step , move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start.';
      return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });


    let status;
    if ( winner != null){
      status = winner + ' is the winner.';
    }else{
      status = this.state.xIsNext ? 'Next player: X' : 'Next player: O';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

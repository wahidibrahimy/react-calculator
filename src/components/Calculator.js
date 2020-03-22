import React from "react";
import "./style.css";
//1. What state is there?
//2. When does it change?

class AutoShrinkingText extends React.Component {
  state = {
    scale: 1
  };
  componentDidUpdate() {
    const { scale } = this.state;
    const node = this.node;
    const parentNode = node.parentNode;
    const availableWidth = parentNode.offsetWidth;
    const actualWidth = node.offsetWidth;
    const actualScale = availableWidth / actualWidth;
    if (scale === actualScale) return;
    if (actualScale < 1) {
      this.setState({
        scale: actualScale
      });
    } else if (scale < 1) {
      this.setState({
        scale: 1
      });
    }
  }
  render() {
    const { scale } = this.state;
    console.log(scale);
    return (
      <div
        className="auto-scaling-text"
        {...this.props}
        style={{ transform: `scale(${scale},${scale})` }}
        ref={node => (this.node = node)}
      />
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      displayValue: "0",
      waitingForOperaand: false,
      operator: null
    };
  }
  clearDisplay() {
    this.setState({
      displayValue: "0"
    });
  }
  inputDigit(digit) {
    const { displayValue, waitingForOperaand } = this.state;
    if (waitingForOperaand) {
      this.setState({
        displayValue: String(digit),
        waitingForOperaand: false
      });
    } else {
      this.setState({
        displayValue:
          displayValue === "0" ? String(digit) : displayValue + digit
      });
    }
  }
  inputDot() {
    const { displayValue, waitingForOperaand } = this.state;
    if (waitingForOperaand) {
      this.setState({
        displayValue: ".",
        waitingForOperaand: false
      });
    } else if (displayValue.indexOf(".") === -1) {
      this.setState({
        displayValue: displayValue + ".",
        waitingForOperaand: false
      });
    }
  }
  toggleSign() {
    const { displayValue } = this.state;
    this.setState({
      displayValue:
        displayValue.charAt(0) === "-"
          ? displayValue.substr(1)
          : "-" + displayValue
    });
  }
  inputPercent() {
    const { displayValue } = this.state;
    const value = parseFloat(displayValue);
    this.setState({
      displayValue: String(value / 100)
    });
  }
  performOperation(nextOperator) {
    const { displayValue, operator, value } = this.state;

    const nextValue = parseFloat(displayValue);

    const operations = {
      "/": (preValue, nextValue) => preValue / nextValue,
      "*": (preValue, nextValue) => preValue * nextValue,
      "+": (preValue, nextValue) => preValue + nextValue,
      "-": (preValue, nextValue) => preValue - nextValue,
      "=": (preValue, nextValue) => nextValue
    };
    //No previous value, hit a operator key.
    if (value == null) {
      this.setState({
        value: nextValue
      });
    } else if (operator) {
      const currentValue = value || 0;
      const computedValue = operations[operator](currentValue, nextValue);
      this.setState({
        value: computedValue,
        displayValue: String(computedValue)
      });
    }
    this.setState({
      waitingForOperaand: true,
      operator: nextOperator
    });
  }
  render() {
    const { displayValue } = this.state;
    return (
      <div className="calculator">
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
        <AutoShrinkingText className="calculator-display">
          {displayValue}
        </AutoShrinkingText>
        <div className="calculator-keypad">
          <div className="input-keys">
            <div className="function-keys">
              <button
                className="calculator-key key-clear"
                onClick={this.clearDisplay.bind(this)}
              >
                AC
              </button>
              <button
                className="calculator-key key-sign"
                onClick={() => this.toggleSign()}
              >
                &#177;
              </button>
              <button
                className="calculator-key key-percent"
                onClick={() => this.inputPercent()}
              >
                %
              </button>
            </div>
            <div className="digit-keys">
              <button
                className="calculator-key key-0"
                onClick={this.inputDigit.bind(this, 0)}
              >
                0
              </button>
              <button
                className="calculator-key key-dot"
                onClick={this.inputDot.bind(this)}
              >
                .
              </button>
              <button
                className="calculator-key key-1"
                onClick={this.inputDigit.bind(this, 1)}
              >
                1
              </button>
              <button
                className="calculator-key key-2"
                onClick={this.inputDigit.bind(this, 2)}
              >
                2
              </button>
              <button
                className="calculator-key key-3"
                onClick={this.inputDigit.bind(this, 3)}
              >
                3
              </button>
              <button
                className="calculator-key key-4"
                onClick={this.inputDigit.bind(this, 4)}
              >
                4
              </button>
              <button
                className="calculator-key key-5"
                onClick={this.inputDigit.bind(this, 5)}
              >
                5
              </button>
              <button
                className="calculator-key key-6"
                onClick={this.inputDigit.bind(this, 6)}
              >
                6
              </button>
              <button
                className="calculator-key key-7"
                onClick={this.inputDigit.bind(this, 7)}
              >
                7
              </button>
              <button
                className="calculator-key key-8"
                onClick={this.inputDigit.bind(this, 8)}
              >
                8
              </button>
              <button
                className="calculator-key key-9"
                onClick={this.inputDigit.bind(this, 9)}
              >
                9
              </button>
            </div>
          </div>
          <div className="operator-keys">
            <button
              className="calculator-key key-divide"
              onClick={() => this.performOperation("/")}
            >
              /
            </button>
            <button
              className="calculator-key key-multiply"
              onClick={() => this.performOperation("*")}
            >
              x
            </button>
            <button
              className="calculator-key key-subtract"
              onClick={() => this.performOperation("-")}
            >
              -
            </button>
            <button
              className="calculator-key key-add"
              onClick={() => this.performOperation("+")}
            >
              +
            </button>
            <button
              className="calculator-key key-equals"
              onClick={() => this.performOperation("=")}
            >
              =
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Calculator;

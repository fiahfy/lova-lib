import React, {Component, PropTypes} from 'react';
import {DropTarget} from 'react-dnd';
import classNames from 'classnames';
import Card from './card';

class CardContainer extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    onDrop: PropTypes.func,
    disabled: PropTypes.bool,
    index: PropTypes.number,
    card: PropTypes.object
  };

  render() {
    const {connectDropTarget, isOver, canDrop} = this.props;
    const isActive = isOver && canDrop;

    let backgroundColor = null;
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

    const tribeCls = this.props.card ? `tribe-${this.props.card.tribe_id}` : null;
    const cls = classNames('card', tribeCls);
    const bgImage = this.props.index <= 5 ? 'deck.png' : 'side-board.png';

    return connectDropTarget(
      <div className={cls}>
        <div className="background">
          <img src={`/assets/img/m/${bgImage}`}
               className="img-rounded img-responsive" style={{backgroundColor: backgroundColor}} />
        </div>
        <Card index={this.props.index} card={this.props.card} />
      </div>
    );
  }
}
export default DropTarget((props) => (props.disabled ? '' : 'card'), {
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  }
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(CardContainer);

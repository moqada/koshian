import React from 'react-native';
import yugo from 'yugo';
import {EASE_KEY_OPEN, EASE_OUT_EXPO} from '../constants/easing';
import KeyboardChangeButtons from './KeyboardChangeButtons';
import zn from '../styles/zn';
import styles from '../styles/components/timerForm';

const KEYBOARD_CHANGE_BUTTONS_HEIGHT = 32;
const {
  Animated,
  Easing,
  DeviceEventEmitter,
  TouchableHighlight,
  Text,
  TextInput,
  View
} = React;


export default class TimerForm extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    onPressStartButton: React.PropTypes.func.isRequired,
    timer: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
      pan: new Animated.ValueXY(),
      keyboardType: 'label'
    };
    this.updateKeyboardSpace = this.updateKeyboardSpace;
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace);
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('keyboardWillShow');
  }

  /**
   * キーボードが表示される際に
   * キーボードの高さ分フォームを移動
   *
   * @param {Object} frames frames
   */
  updateKeyboardSpace = frames => {
    Animated.timing(this.state.pan, {
      easing: Easing.bezier(...EASE_KEY_OPEN),
      duration: 300,
      toValue: {x: 0, y: -(frames.endCoordinates.height + KEYBOARD_CHANGE_BUTTONS_HEIGHT)}
    }).start();
  }

  /**
   * フォームを閉じる
   */
  closeForm() {
    Animated.timing(this.state.pan, {
      easing: Easing.bezier(...EASE_OUT_EXPO),
      duration: 1000,
      toValue: {x: 0, y: 0}
    }).start();
  }

  /**
   * フォームへのフォーカス時にフォームの位置を調整
   */
  onFocus = () => {
    this.setState({
      isFocus: true,
      keyboardType: 'label'
    });
  }

  /**
   * リターンキーが押下された場合フォームを閉じる
   */
  onSubmitEditing = () => {
    this.closeForm();
  }

  /**
   * キーボード選択ボタンが押下された場合
   * キーボードを切り替える
   *
   * @param {string} ref 押下されたキーボード
   */
  onPressButton(ref) {
    if (ref === 'label') {
      this.refs.timer.focus();
    } else {
      this.refs.timer.blur();
    }
    this.setState({keyboardType: ref});
  }

  onPressStartButton = () => {
    this.props.onPressStartButton({
      description: 'hoge'
    });
  }

  /**
   * フォーム内がタッチされた場合、フォームを閉じない
   *
   * @param {Event} e event
   */
  onTouchStartForm = e => {
    e.stopPropagation();
  }

  /**
   * フォーム外がタッチされた場合、フォームを閉じる
   */
  onTouchStartView = () => {
    if (this.state.isFocus) {
      this.setState({isFocus: false});
      this.closeForm();
      this.refs.timer.blur();
    }
  }

  /**
   * Form の props を返す
   *
   * @return {Object} props
   */
  getFormProps() {
    return {
      controlled: true,
      keyboardType: 'default',
      onFocus: this.onFocus,
      style: styles.textInput,
      onEndEditing: this.onEndEditing,
      onSubmitEditing: this.onSubmitEditing,
      placeholder: 'タイマーを追加',
      ref: 'timer'
    };
  }

  /**
   * レンダリング
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <View
        onTouchStart={this.onTouchStartView}
        style={yugo(styles.view, [styles.viewIsFocus, this.state.isFocus])}
      >
        <Animated.View
          onTouchStart={this.onTouchStartForm}
          style={yugo(styles.animatedView, {transform: this.state.pan.getTranslateTransform()})}
        >
          <View style={styles.formWrapper}>
            <TextInput {...this.getFormProps()} />
            <TouchableHighlight
              onPress={this.onPressStartButton}
              style={styles.startButton}
              underlayColor={zn.color.blue600}
            >
              <Text style={styles.startButtonLabel}>START</Text>
            </TouchableHighlight>
          </View>
          <KeyboardChangeButtons
            keyboardType={this.state.keyboardType}
            onPressButton={this.onPressButton.bind(this)}
          />
        </Animated.View>
      </View>
    );
  }
}

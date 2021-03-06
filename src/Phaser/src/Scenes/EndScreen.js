import Phaser from 'phaser';
import { getDimensions } from '../Game/gameSettings';
import { BLACK, WHITE } from '../Common/colours';
import { GESTURES, gestureDetection } from '../Game/gestures';

export default class EndScreen extends Phaser.Scene {
  constructor() {
    super('EndScreen');
  }

  init(data) {
    this.settings = data.settings;
    this.results = data.results;
    this.handleGesture = this.handleGesture.bind(this);
  }

  create() {
    this.cameras.main.setBackgroundColor(WHITE);
    this.keys = this.input.keyboard.addKeys({
      continue: 'Enter'
    });
    gestureDetection(this.input, this.handleGesture);

    this.gameDimensions = getDimensions(this.game);

    this.drawScreen();
  }

  drawScreen() {
    let gameOver = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 3,
      'Game Over',
      {
        fontFamily: 'Ubuntu',
        fill: BLACK,
        fontSize: this.gameDimensions.textSize1
      }
    );
    gameOver.setOrigin(0.5, 0.5);

    let message = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 7,
      this.results.message,
      {
        fontFamily: 'Ubuntu',
        fill: this.results.messageColour,
        fontSize: this.gameDimensions.textSize2
      }
    );
    message.setOrigin(0.5, 0.5);

    let combo = this.add.text(
        this.gameDimensions.screenCenter,
        this.gameDimensions.screenSpaceUnit * 13,
        `Final Combo: ${this.results.combo[0]} ${this.results.combo[1]} ${this.results.combo[2]}`,
        {
          fontFamily: 'Ubuntu',
          fill: BLACK,
          fontSize: this.gameDimensions.textSize4
        }
    );
    combo.setOrigin(0.5, 0.5);

    let returnScreen = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 18,
      'Press enter to exit to menu.',
      {
        fontFamily: 'Ubuntu',
        fill: BLACK,
        fontSize: this.gameDimensions.textSize4
      }
    );
    returnScreen.setOrigin(0.5, 0.5);
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SINGLE_TAP) {
      this.scene.start('MainMenu', this.settings);
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.continue)) {
      this.scene.start('MainMenu', this.settings);
    }
  }
}

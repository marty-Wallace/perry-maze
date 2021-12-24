import React from 'react';
import Phaser from 'phaser';
import MainMenu from './Scenes/MainMenu';
import Settings from './Scenes/Settings';
import GamemodeSolo from './Scenes/GamemodeSolo';
import EndScreen from './Scenes/EndScreen';
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

export default class Game extends React.Component {
  componentDidMount() {
    const dimension = this._getDimensions();
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-parent',
      pixelArt: true,
      width: dimension * 0.9,
      height: dimension * 0.9,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      input: {
        activePointers: 5 // Set the number of allowed active pointers
      },
      scene: [
        MainMenu,
        Settings,
        GamemodeSolo,
        EndScreen
      ],
      plugins: {
        scene: [{
          key: 'GamemodeSolo',
          plugin: UIPlugin,
          mapping: 'rexUI'
        },
        ]
      }
    };

    new Phaser.Game(config);
  }

  /**
   * Returns the smaller of window.innerWidth and window.innerHeight
   */
  _getDimensions() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    if (width < height) {
      return width;
    } else {
      return height;
    }
  }

  render() {
    return <div id="phaser-parent" />;
  }
}

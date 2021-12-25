import Phaser from 'phaser';
import {BLACK, BLACK_0x, BLUE_0x, GRAY_0x} from '../Common/colours';
import GameMaze from '../Game/gameMaze';
import Character from '../Game/character';
import {gestureDetection, GESTURES} from '../Game/gestures';
import {GAMEMODES} from '../Game/gameSettings';

export default class GamemodeSolo extends Phaser.Scene {
    constructor() {
        super('GamemodeSolo');
    }

    init(data) {
        this.settings = data;
        this.handleGesture = this.handleGesture.bind(this);
        this.actionClock = 0;
        this.actionCooldown = 100; // Time in milliseconds
        this.cam = this.cameras.main;
        this.rotation = 0;
        this.state = 'normal';
        this.flip = false;
        this.original = {
            x: this.cam.x,
            y: this.cam.y,
        }
    }

    preload() {
        // Load assets...
    }

    create() {
        this.cameras.main.setBackgroundColor(BLACK_0x);
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            arrowUp: 'up',
            down: 'S',
            arrowDown: 'down',
            left: 'A',
            arrowLeft: 'left',
            right: 'D',
            arrowRight: 'right',
            exit: 'Esc'
        });
        gestureDetection(this.input, this.handleGesture);

        this.graphics = this.add.graphics();

        this.maze = new GameMaze(this.game, this.graphics, this.settings.gridSize);

        let initialPosition = {
            x: 0,
            y: 0
        };
        this.character = new Character(this.maze, initialPosition, {
            smoothMovement: true
        });

        this.combo = [0, 0, 0];

        this.endPoints = [
            {
                x: this.settings.gridSize - 1,
                y: this.settings.gridSize - 1,
                clue: {pos: 1, num: 12,},
                found: false,
            },
            {
                x: this.settings.gridSize - 1,
                y: 0,
                clue: {pos: 2, num: 2,},
                found: false,
            },
            {
                x: 0,
                y: this.settings.gridSize - 1,
                clue: {pos: 3, num: 35,},
                found: false,
            }
        ];

        this.maze.drawMaze();

        // Draw the endpoint
        this.endPoints.forEach(endPoint => {
            this.maze.fillGrid(endPoint, endPoint.found ? BLUE_0x : GRAY_0x);
        });

        // Draw the player
        this.character.drawCharacter();

        this.timer = new Date().getTime();
    }

    handleGesture(detection) {
        if (detection.gesture === GESTURES.SWIPE_LEFT) {
            this.updateMovement(Character.DIRECTIONS.LEFT);
        } else if (detection.gesture === GESTURES.SWIPE_RIGHT) {
            this.updateMovement(Character.DIRECTIONS.RIGHT);
        } else if (detection.gesture === GESTURES.SWIPE_UP) {
            this.updateMovement(Character.DIRECTIONS.UP);
        } else if (detection.gesture === GESTURES.SWIPE_DOWN) {
            this.updateMovement(Character.DIRECTIONS.DOWN);
        }
    }

    updateMovement(direction) {
        // Move the character
        this.character.moveCharacter(direction);

        if( this.state === 'shake') {
            this.cam.pan(this.character.position.x * this.maze.sideLength -1, this.character.position.y * this.maze.sideLength -1);
        }
        // Check if player is in the finish position, if yes, finish game
        this.endPoints.forEach(endPoint => {
            if (
                this.character.position.x === endPoint.x &&
                this.character.position.y === endPoint.y
            ) {
                this.combo[endPoint.clue.pos - 1] = endPoint.clue.num

                if (!endPoint.found) {
                    if(this.state === 'shake') {
                        this.state = 'finished';
                        this.cameras.resetAll();
                    }
                    this.rexUI.modalPromise(
                        this.createDialog(this, endPoint).setPosition(400, 400),
                        {
                            manualClose: true,
                            duration: {
                                in: 500,
                                out: 500
                            }
                        }
                    ).then(() => {
                        if( this.state === 'normal') {
                            this.cam.zoomTo(0.75);
                            this.state = 'rotate';
                        } else if( this.state === 'rotate') {
                            this.cam.zoomTo(1.5);
                            this.cam.pan(this.character.position.x * this.maze.sideLength -1, this.character.position.y * this.maze.sideLength -1);
                            this.state = 'shake';
                        }

                    });
                }

                endPoint.found = true;
            }

        });

    }

    createDialog(scene, endPoint) {
        const dialog = scene.rexUI.add.dialog({
            background: scene.rexUI.add.roundRectangle(400, 400, 400, 100, 20, 0x1565c0),
            content: scene.add.text(0, 0, `Combination #${endPoint.clue.pos} is ${endPoint.clue.num}`, {
                fontSize: '24px'
            }),

            actions: [
                scene.rexUI.add.label({
                    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),
                    text: scene.add.text(0, 0, 'Ok', {
                        fontSize: '24px'
                    }),
                    space: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    }
                })
            ],
            space: {
                title: 25,
                content: 25,
                action: 15,

                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },
            align: {
                actions: 'right', // 'center'|'left'|'right'
            },
            expand: {
                content: false,  // Content is a pure text object
            }
        }).layout();

        dialog
            .on('button.click', function (button, groupName, index, pointer, event) {
                dialog.emit('modal.requestClose', {index: index, text: button.text});

                if (
                    scene.endPoints[0].found &&
                    scene.endPoints[1].found &&
                    scene.endPoints[2].found
                ) {
                    let finishTime = Math.floor((new Date().getTime() - scene.timer) / 1000);
                    scene.scene.start('EndScreen', {
                        settings: this.settings,
                        results: {
                            gameMode: GAMEMODES.SOLO.id,
                            message: `Time: ${finishTime} s`,
                            messageColour: BLACK,
                            combo: scene.combo,
                        }
                    });
                }
            })
            .on('button.over', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            })
            .on('button.out', function (button, groupName, index, pointer, event) {
                button.getElement('background').setStrokeStyle();
            });

        return dialog;
    }

    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.keys.exit)) {
            this.scene.start('MainMenu', this.settings);
        }

        if(this.state === 'rotate') {
            this.cam.rotateTo(this.rotation += 0.005, true, this.actionCooldown * 6)
        }
        if(this.state === 'shake' ) {
            this.cam.rotateTo((this.rotation += 0.015), true, this.actionCooldown * 6)
        }

        if (new Date().getTime() - this.actionClock > this.actionCooldown) {
            if (this.keys.up.isDown || this.keys.arrowUp.isDown) {
                this.updateMovement(Character.DIRECTIONS.UP);
                this.actionClock = new Date().getTime();
            } else if (this.keys.down.isDown || this.keys.arrowDown.isDown) {
                this.updateMovement(Character.DIRECTIONS.DOWN);
                this.actionClock = new Date().getTime();
            } else if (this.keys.left.isDown || this.keys.arrowLeft.isDown) {
                this.updateMovement(Character.DIRECTIONS.LEFT);
                this.actionClock = new Date().getTime();
            } else if (this.keys.right.isDown || this.keys.arrowRight.isDown) {
                this.updateMovement(Character.DIRECTIONS.RIGHT);
                this.actionClock = new Date().getTime();
            }
        }

        this.character.update();
    }
}

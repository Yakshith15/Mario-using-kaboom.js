//IMPORTANT: Make sure to use Kaboom version 0.5.0 for this game by adding the correct script tag in the HTML file.

kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 0, 1],
})

// Speed identifiers
const MOVE_SPEED = 120
const JUMP_FORCE = 400
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
const FALL_DEATH = 400
const shroomSpeed = 20
const shroomDirection=-1
// Game logic

let isJumping = true
let isBig = false

loadSprite('coin', 'coin.png')
loadSprite('evil-shroom', 'evilshroom.png')
loadSprite('brick', 'brick.png')
loadSprite('block', 'block1.png')
loadSprite('mario', 'mario.png')
loadSprite('mushroom', 'mushroom.png')
loadSprite('surprise', 'suprise.png')
loadSprite('unboxed', 'block.png')
loadSprite('pipe-top-left', 'ptl.png')
loadSprite('pipe-top-right', 'ptr.png')
loadSprite('pipe-bottom-left', 'pbl.png')
loadSprite('pipe-bottom-right', 'pbr.png')

loadSprite('blue-block', 'bblock.png')
loadSprite('blue-brick', 'bbrick.png')
loadSprite('blue-steel', 'bsteal.png')
loadSprite('blue-evil-shroom', 'beshroom.png')
loadSprite('blue-surprise', 'bsuprise.png')



scene("game", ({ level, score }) => {
  layers(['bg', 'obj', 'ui'], 'obj')

  const maps = [
    [
      '                                                                                                                                                                                                                                                                                ',
      '                                                                                                                                                                                                                                                                                ',
      '                                                                                                                                                                                                                                                                                ',
      '                                                                                                                                                                                                                                                                                ',
      '                                                                                                                                                                                                                                                                                ',
      '                                                       %                                                                                                                                                                                                                  }     ',
      '                                                                                                                                                                                                                                                                         }}     ',
      '                                                                                                                                ^========   ====*                                                                                                                       }}}     ',
      '                                                                                                                                                                       *           ===     =%%=                                              }   }                     }}}}     ',
      '                                                 *   =%=%=                                      -+        -+                                                                                                        }    }                  }}   }}                   }}}}}     ',
      '                                                                                     -+         ()        ()                   =%=              ==        ===      %   %   %     =           ==                    }}    }}                }}}   }}}                 }}}}}}     ',
      '                                                                         -+          ()         ()        ()                                                                                                      }}}    }}}              }}}}   }}}}               }}}}}}}   <>',
      '                                                                 ^   ^   ()          ()         ()        ()                    ^                     ^             ^                                            }}}}    }}}}            }}}}}   }}}}}             }}}}}}}}   ()',
      '==============================================================================================================================================================================================================================================   ===============================',
    ],
    [ '£                                                                                 £',
      '£                                                                                 £',
      '£                                                                                 £',
      '£                                                                                 £',
      '£                                                                                 £',
      '£                                                                                 £',
      '£                                                                                 £',
      '£                                                                                 £',
      '£                                                                                 £',
      '£                                                  @@@@@@              x x        £',
      '£                                                                    x x x      <>£',
      '£                                                                  x x x x  x   ()£',
      '£                                                         z   z  x x x x x  x   ()£',
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    ]
  ]

  const levelCfg = {
    width: 20,
    height: 20,
    '=': [sprite('brick'), solid()],
    '$': [sprite('coin'), 'coin'],
    '%': [sprite('surprise'), solid(), 'coin-surprise'],
    '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
    '}': [sprite('unboxed'), solid()],
    '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
    ')': [sprite('pipe-bottom-right'), solid(), scale(0.5),'pr'],
    '-': [sprite('pipe-top-left'), solid(), scale(0.5), ],
    '+': [sprite('pipe-top-right'), solid(), scale(0.5), ],
    '<': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
    '>': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
    '^': [sprite('evil-shroom'), solid(), 'dangerous',body()],
    '#': [sprite('mushroom'), solid(), 'mushroom', body()],
    '!': [sprite('blue-block'), solid(), scale(0.5)],
    '£': [sprite('blue-brick'), solid(), scale(0.5)],
    'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous',],
    '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
    'x': [sprite('blue-steel'), solid(), scale(0.5)],

  }

  const gameLevel = addLevel(maps[level], levelCfg)

  const scoreLabel = add([
    text('score '+score),
    pos(430, 200),
    layer('ui'),
    {
      value: score,
    }
  ])

  // const scoreLabel=add([text('score '+parseInt(score)), pos(30,6),layer('ui')])
  add([text('level ' + parseInt(level + 1) ), pos(560, 200)])
  
  function big() {
    let timer = 0
    
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
          timer -= dt()
          if (timer <= 0) {
            this.smallify()
          }
        }
      },
      // isBig() {
      //   return isBig
      // },
      smallify() {
        this.scale = vec2(1)
        CURRENT_JUMP_FORCE = JUMP_FORCE
        timer = 0
        isBig = false
      },
      biggify(time) {
        this.scale = vec2(2)
        timer = time
        isBig = true     
      }
    }
  }

  // const p2=add([
  //   sprite('evil-shroom'),
  // ])

  const player = add([
    sprite('mario'), solid(),
    pos(500, 0),
    body(),
    big(),
    origin('bot')
  ])

  // const enemy=add([
  //   sprite('evil-shroom'), body()
  // ])
  action('mushroom', (m) => {
    m.move(20, 0)
  })

  player.on("headbump", (obj) => {
    if (obj.is('coin-surprise')) {
      gameLevel.spawn('$', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    if (obj.is('mushroom-surprise')) {
      gameLevel.spawn('#', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
  })

  player.collides('mushroom', (m) => {
    destroy(m)
    player.biggify(10)
  })

  player.collides('coin', (c) => {
    destroy(c)
    scoreLabel.value++
    scoreLabel.text = ('score '+scoreLabel.value)
  })

  action('dangerous', (d) => {
    d.move(-shroomSpeed, 0)

    // d.pos.y += dt() * 400
  })

  // action('dangerous', (shroom) => {
  //   // Update shroom's position based on direction
  //   shroom.move(shroomDirection * shroomSpeed, 0); // Adjust 'shroomSpeed' as needed
  // });
  
  // action('dangerous', (shroom) => {
  //   // Check for collision with pipes
  //   if (shroom.collides('pr')) {
  //     // Change shroom direction when it collides with a pipe
  //     shroomDirection *= -1; // Reverse the direction
  //     shroom.move(shroomDirection * shroomSpeed, 0);
  //   }
  // });
  
  // action('dangerous', (shroom) => {
  //   // Check for collision with pipes
  //   if (shroom.collides('pr')) {
  //     // Change shroom direction when it collides with a pipe
  //     shroomDirection *= -1; // Reverse the direction
  //     shroom.move(shroomDirection * shroomSpeed, 0);
  //   }
  // });
  
  

  player.collides('dangerous', (d) => {
    if (isJumping || isBig) {
      destroy(d)
    } else {
      go('lose', { score: scoreLabel.value})
    }
  })

  player.action(() => {
    camPos(player.pos)
    if (player.pos.y >= FALL_DEATH) {
      go('lose', { score: scoreLabel.value})
    }
  })

  player.collides('pipe', () => {
      
      go('game', {
        level: (level + 1) % maps.length,
        score: scoreLabel.value
      })
    
  })

  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0)
  })

  keyDown('right', () => {
    player.move(MOVE_SPEED, 0)
  })

  player.action(() => {
    if(player.grounded()) {
      isJumping = false
    }
  })

  keyPress('space', () => {
    if (player.grounded()) {
      isJumping = true
      player.jump(CURRENT_JUMP_FORCE)
    }
  })
})

scene('lose', ({ score }) => {
  add([text('score '+score, 32), origin('center'), pos(width()/2, height()/ 2)])
})

start("game", { level: 0, score: 0})

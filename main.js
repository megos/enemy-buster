const SCREEN_WIDTH = 640
const SCREEN_HEIGHT = 960
const MAX_ENEMIES = 32
const assets = {
  image: {
    bg: './assets/room_office_normal.png',
    sword: './assets/bug_haetataki.png',
    enemy: './assets/enemy.png',
    explosion: './assets/fukidashi12.png',
  },
}

phina.globalize()

phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function () {
    this.superInit()
    this.backgroundColor = 'grey'
    this.bg = Sprite('bg', SCREEN_WIDTH, SCREEN_WIDTH).addChildTo(this)
    this.bg.origin.set(0, 0)
    this.bg.y = (SCREEN_HEIGHT - SCREEN_WIDTH) / 2

    this.score = 0
    const self = this

    for (let i = 0; i < MAX_ENEMIES; i++) {
      const enemy = Sprite('enemy', 64, 64).addChildTo(this)
      const explosion = Sprite('explosion', 64, 64)
        .setScale(0, 0)
        .addChildTo(this)
        .hide()
      enemy.x = Math.randint(0, this.width)
      enemy.y = Math.randint(0, this.height)
      enemy.rotation = Math.randint(0, 360)

      enemy.update = function () {
        const signX = Math.random() > 0.5 ? +1 : -1
        const signY = Math.random() > 0.5 ? +1 : -1
        let nextX = this.x + signX * Math.random() * 4
        let nextY = this.y + signY * Math.random() * 4
        if (nextX < 0) nextX = 0
        if (nextY < 0) nextY = 0
        if (nextX > self.width) nextX = self.width
        if (nextY > self.height) nextY = self.height
        this.x = nextX
        this.y = nextY
      }
      enemy.setInteractive(true)
      enemy.onpointstart = function () {
        this.setInteractive(false)
        explosion.x = this.x
        explosion.y = this.y
        explosion.show()
        explosion.tweener.scaleTo(1, 100).play()
        explosion.tweener.fadeOut(100).play()
        this.hide()
        self.score += 1
      }
    }

    this.time = 0
    const timerLabel = Label('0').addChildTo(this)
    timerLabel.origin.x = 1
    timerLabel.x = SCREEN_WIDTH - 20
    timerLabel.y = 20
    timerLabel.fill = '#fff'
    timerLabel.fontSize = 50
    timerLabel.baseline = 'top'
    this.timerLabel = timerLabel
  },
  update: function (app) {
    this.time += app.ticker.deltaTime
    const sec = this.time / 1000
    this.timerLabel.text = sec.toFixed(2)

    if (this.score === MAX_ENEMIES) {
      this.exit({
        score: `${this.timerLabel.text} s`,
        backgroundColor: 'white',
        message: '♡CLEAR♡',
        fontColor: '#edccdd',
        url: '',
      })
    }
  },
  onenter: function () {
    var scene = CountScene({
      backgroundColor: 'rgba(100, 100, 100, 1)',
      count: ['Ready'],
      fontSize: 100,
    })
    this.app.pushScene(scene)
  },
})

phina.define('TitleScene', {
  superClass: 'DisplayScene',
  init: function () {
    this.superInit()
    this.backgroundColor = 'white'

    const swordLeft = Sprite('sword').setScale(0.4, 0.4).addChildTo(this)
    swordLeft.x = 100
    swordLeft.y = 500
    const swordRight = Sprite('sword').setScale(0.4, 0.4).addChildTo(this)
    swordRight.x = SCREEN_WIDTH - 100
    swordRight.y = 500
    swordRight.scaleX *= -1

    Label({
      text: '赤い虫を\nやっつけろ！',
      fontSize: 64,
      fill: '#919fcc',
    })
      .addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.span(4))

    Label({
      text: 'TOUCH START',
      fontSize: 32,
      fill: '#919fcc',
    })
      .addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.span(12))
      .tweener.fadeOut(1000)
      .fadeIn(500)
      .setLoop(true)
      .play()
    this.on('pointend', function () {
      this.exit()
    })
  },
})

phina.main(function () {
  var app = GameApp({
    startLabel: 'title',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets,
  })

  // app.enableStats()
  app.run()
})

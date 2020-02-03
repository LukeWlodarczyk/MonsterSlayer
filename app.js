let id = 0;

new Vue({
  el: '#app',
  data: {
    isGameStarted: false,
    player: {
      name: '',
      isSpecialAttackUsed: false,
      health: 100
    },
    monster: {
      health: 100
    },
    comments: []
  },
  methods: {
    messageStyle(who) {
      return who === 'monster' ? 'monster-turn' : 'player-turn';
    },
    getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    finishGame() {
      this.isGameStarted = false;
    },
    isDead(health) {
      return health < 1;
    },
    hurt(who, count) {
      this[who].health = this[who].health - count;
    },
    cure(who, count) {
      this[who].health = this[who].health + count;
    },
    toggleMoves(lastMove) {
      if (lastMove === 'player' && this.isDead(this.monster.health)) {
        this.generateComment(lastMove, 'win');
        this.finishGame();
      } else if (lastMove === 'player') {
        this.generateMonsterAttack();
      } else if (lastMove === 'monster' && this.isDead(this.player.health)) {
        this.generateComment(lastMove, 'win');
        this.finishGame();
      }
    },
    startGame() {
      this.isGameStarted = true;
      this.player.isSpecialAttackUsed = false;
      this.player.health = 100;
      this.monster.health = 100;
      this.comments = [];
    },
    attack(who = 'player') {
      let damage = this.getRandomNumber(1, 20);

      if (who === 'player') {
        this.hurt('monster', damage);
      } else {
        this.hurt('player', damage);
      }

      this.generateComment(who, 'attack', damage);
      this.toggleMoves(who);
    },
    specialAttack(who = 'player') {
      let damage = this.getRandomNumber(20, 30);

      if (who === 'player') {
        this.player.isSpecialAttackUsed = true;
        this.hurt('monster', damage);
        this.hurt('player', 10);
      } else {
        this.hurt('player', damage);
        this.hurt('monster', 10);
      }

      this.generateComment(who, 'specialAttack', damage);
      this.toggleMoves(who);
    },
    heal(who = 'player') {
      const heal = this.getRandomNumber(1, 10);

      if (who === 'player') {
        this.cure('player', heal);
      } else {
        this.cure('monster', heal);
      }

      this.generateComment(who, 'heal', heal);
      this.toggleMoves(who);
    },
    giveUp() {
      this.finishGame();
      this.generateComment('player', 'giveUp');
    },
    generateComment(who, type, count) {
      const one = who == 'player' ? this.player.name : 'monster';
      const two = one === 'monster' ? this.player.name : 'monster';

      let message = '';
      if (type === 'attack') {
        message = `${one} hits ${two} for ${count}`;
      }
      if (type === 'specialAttack') {
        message = `${one} use special attack and hits ${two} for ${count}`;
      }
      if (type === 'heal') {
        message = `${one} heals himself for ${count}`;
      }
      if (type === 'giveUp') {
        message = `${one} gives up`;
      }
      if (type === 'win') {
        message = `${one} wins!`;
      }
      this.comments.unshift({ id: id++, who: one, content: message });
    },
    generateMonsterAttack() {
      const availableMoves = [this.attack, this.specialAttack, this.heal];

      if (this.monster.health >= 90) {
        const randomNumber = this.getRandomNumber(0, 1);
        availableMoves[randomNumber]('monster');
      }
      if (this.monster.health < 90 && this.monster.health > 15) {
        const randomNumber = this.getRandomNumber(0, 2);
        availableMoves[randomNumber]('monster');
      }
      if (this.monster.health <= 15) {
        availableMoves[2]('monster');
      }
    }
  }
});

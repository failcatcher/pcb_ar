export default class Message {
  constructor() {
    this.messageBlock = document.createElement('div');
    this.messageBlock.setAttribute('id', 'message');
    this.messageBlock.setAttribute('class', 'message');
    document.body.appendChild(this.messageBlock);
  }

  show(msg) {
    this.messageBlock.innerHTML = msg;

    if (!this.messageBlock.classList.contains('visible')) {
      this.messageBlock.classList.add('visible');
    }
  }

  hide() {
    this.messageBlock.innerHTML = '';
    if (this.messageBlock.classList.contains('visible')) {
      this.messageBlock.classList.remove('visible');
    }
  }
}

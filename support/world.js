const { setWorldConstructor, World } = require('@cucumber/cucumber');
class CustomWorld extends World { constructor(o) { super(o); this.state = {}; } }
setWorldConstructor(CustomWorld);

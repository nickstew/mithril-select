function selectTesting(mock){
  m.deps(mock);

  describe('Select Component', function() {
    const Select = require('../select');
    describe('SelectViewModel', function() {

      describe('constructor', function() {
        describe('uses lodash.extend to build config object with defaults', function(){
          it('should smash the defaults with explicit config', function() {
            let config = {
              label: 'Clients',
              isEqual: function(){return true;}
            };
            const defaultConfig = {
              label: '',
              options: [],
              isEqual: function(optionA, optionB) {
                if(!optionA || !optionB) {
                  return false;
                }
                return optionA.display === optionB.display;
              }
            };
            const extend = require('lodash/extend');
            config = extend({}, defaultConfig, config);
            config.label.should.equal('Clients');
            defaultConfig.label.should.equal('');
            config.options.should.have.length(0);
            config.isEqual().should.be.true();
          });
        });
      });
    });
  });
}
selectTesting(mock.window);

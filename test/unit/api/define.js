/* eslint-env jasmine, mocha */

import { Component, define } from '../../../src/index';

const { customElements, HTMLElement } = window;

describe('api/define', () => {
  it('should throw if the constructor does not extend HTMLElement', () => {
    expect(() => define(() => {})).to.throw();
    expect(() => define(HTMLElement)).to.throw();
  });

  describe('`static is`', () => {
    describe('present', () => {
      it('should be used as the element name', () => {
        const name = 'x-test-unique';
        const Elem = define(class extends HTMLElement {
          static is = name
        });
        expect(Elem.is).to.equal(name);
        expect(customElements.get(Elem.is)).to.equal(Elem);
      });

      it('should throw if already defined', () => {
        const name = 'x-test-uber-unique-and-stuff';
        define(class extends HTMLElement {
          static is = name
        });
        expect(() => {
          define(class extends HTMLElement {
            static is = name
          });
        }).to.throw();
      });
    });

    describe('absent', () => {
      it('should define a component with a unique name', () => {
        const Elem1 = define(class extends HTMLElement {});
        const Elem2 = define(class extends HTMLElement {});

        expect(Elem1.is).to.contain('x-');
        expect(Elem2.is).to.contain('x-');
        expect(Elem1.is).not.to.equal(Elem2.is);
        expect(customElements.get(Elem1.is)).to.equal(Elem1);
        expect(customElements.get(Elem2.is)).to.equal(Elem2);
      });

      it('should be extendable with a getter', () => {
        const name = 'x-test-define-unique-1';
        const Elem1 = define(class extends HTMLElement {});
        const Elem2 = define(class extends Elem1 {
          static get is () {
            return name;
          }
        });
        expect(Elem1.is).not.to.equal(Elem2.is);
        expect(Elem2.is).to.equal(name);
      });

      it('should be extendable with a property initialiser', () => {
        const name = 'x-test-define-unique-2';
        const Elem1 = define(class extends HTMLElement {});
        const Elem2 = define(class extends Elem1 {
          static is = name
        });
        expect(Elem1.is).not.to.equal(Elem2.is);
        expect(Elem2.is).to.equal(name);
      });

      it('should be extendable without specifying it at all', () => {
        const Elem1 = define(class extends HTMLElement {});
        const Elem2 = define(class extends Elem1 {});
        expect(Elem1.is).not.to.equal(Elem2.is);
      });
    });
  });
});

/* leave first line blank for cq */
import App from './App';
import React from 'react';
import { shallow } from 'enzyme';

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <App />
    );
  });

  it('should have the `th` "Items"', () => {
    expect(
      wrapper.contains(<th>Items</th>)
    ).toBe(true);
  });

  it('should have a `button` element', () => {
    // Commented part also works
    // const btn = wrapper.find('button').first();
    // expect(
    //   btn !== null
    // ).toBe(true);
    expect(
      wrapper.containsMatchingElement(
        <button>Add item</button>
      )
    ).toBe(true);
  });

  it('should have an `input` element', () => {
    expect(
      wrapper.containsMatchingElement(
        <input />
      )
    ).toBe(true);
  });

  it('`button` should be disabled', () => {
    const button = wrapper.find('button').first();
    expect(
      button.props().disabled
    ).toBe(true);
  });


  // Behavior-driven test
  describe('the user populates the input', () => {
    const item = 'Vancouver';

    beforeEach(() => {
      const input = wrapper.find('input').first();
      input.simulate('change', {
        target: { value: item }
      })
    });

    it('should update the state property `item`', () => {
      expect(
        wrapper.state().item
      ).toEqual(item);
    });

    it('should enable `button`', () => {
      const button = wrapper.find('button').first();
      expect(
        button.props().disabled
      ).toBe(false);
    });

    describe('and then clears the input', () => {
      beforeEach(() => {
        const input = wrapper.find('input').first();
        input.simulate('change', {
          target: { value: '' }
        })
      });

      it('should disable `button`', () => {
        const button = wrapper.find('button').first();
        expect(
          button.props().disabled
        ).toBe(true);
      });
    });

    describe('and then submits the form', () => {
      beforeEach(() => {
        const form = wrapper.find('form').first();
        form.simulate('submit', {
          preventDefault: () => { }
        });
      });

      it('should add the item to state `items`', () => {
        expect(
          wrapper.state().items
        ).toContain(item);
      });

      it('should add the item in the table', () => {
        // This is my way
        // const td = wrapper.find('td').last();
        // expect(
        //   td.containsMatchingElement(<td>{item}</td>)
        // ).toBe(true);

        expect(
          wrapper.containsMatchingElement(<td>{item}</td>)
        ).toBe(true);
      });

      it('should clear the input', () => {
        // My solution
        // expect(
        //   wrapper.state().item
        // ).toBe('');

        const input = wrapper.find('input').first();
        expect(
          input.props().value
        ).toEqual('')
      });

      it('should disable `button`', () => {
        const button = wrapper.find('button').first();
        expect(
          button.props().disabled
        ).toBe(true);
      });
    });

  });
});

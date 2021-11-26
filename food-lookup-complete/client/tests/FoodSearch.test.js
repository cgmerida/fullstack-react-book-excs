// We populate this file in the chapter "Unit Testing"
/* eslint-disable no-unused-vars */
import { shallow } from 'enzyme';
import React from 'react';
import FoodSearch from '../src/FoodSearch';
import Client from '../src/Client';

jest.mock('../src/Client');

describe('FoodSearch', () => {
  let wrapper;
  const onFoodClick = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <FoodSearch
        onFoodClick={onFoodClick}
      />
    )
  });

  afterEach(() => {
    Client.search.mockClear();
    onFoodClick.mockClear();
  });

  it('should not display the remove icon', () => {
    expect(
      wrapper.find('.remove.icon').length
    ).toBeFalsy();
  });


  it('should display zero rows', () => {
    expect(
      wrapper.find('tbody tr').length
    ).toBeFalsy();
  });

  describe('user populates search field', () => {
    const value = 'brocc';

    beforeEach(() => {
      const input = wrapper.find('input').first();
      input.simulate('change', {
        target: { value }
      });
    });

    it('should update state property `searchValue`', () => {
      expect(
        wrapper.state().searchValue
      ).toBe(value);
    });

    it('should display the remove icon', () => {
      expect(
        wrapper.find('.remove.icon').length
      ).toBeTruthy();
    });

    it('should call `Client.search()` with `value`', () => {
      const invocationArgs = Client.search.mock.calls[0];
      expect(
        invocationArgs[0]
      ).toBe(value);
    });

    describe('and API return results', () => {
      const foods = [
        {
          description: 'Broccolini',
          kcal: '100',
          protein_g: '11',
          fat_g: '21',
          carbohydrate_g: '31',
        },
        {
          description: 'Broccoli rabe',
          kcal: '200',
          protein_g: '12',
          fat_g: '22',
          carbohydrate_g: '32',
        },
      ];

      beforeEach(() => {
        const invocationArgs = Client.search.mock.calls[0];
        const cb = invocationArgs[1];
        cb(foods);
        wrapper.update();
      });

      it('should set the state `foods`', () => {
        expect(
          wrapper.state().foods
        ).toEqual(foods);
      });

      it('should display two rows', () => {
        expect(
          wrapper.find('tbody tr').length
        ).toBe(2);
      });


      it('should render the description of first food', () => {
        expect(
          wrapper.find('tbody tr').first().html()
        ).toContain(foods[0].description);
      });

      it('should render the description of second food', () => {
        expect(
          wrapper.find('tbody tr').at(1).html()
        ).toContain(foods[1].description);
      });

      describe('Then user clicks a food item', () => {
        beforeEach(() => {
          const foodRow = wrapper.find('tbody tr').first();
          foodRow.simulate('click');
        });

        it('should call prop `onFoodClick` with `food`', () => {
          const food = foods[0];
          expect(
            onFoodClick.mock.calls[0]
          ).toEqual([food]);
        });

      });

      describe('then user types more', () => {
        const value = 'broccx';

        beforeEach(() => {
          const input = wrapper.find('input').first();
          input.simulate('change', {
            target: { value }
          });
        });

        describe('and API returns no results', () => {
          beforeEach(() => {
            const invocationArgs = Client.search.mock.calls[1];
            const cb = invocationArgs[1];
            cb([]);
            wrapper.update();
          });

          it('should set the state property `foods`', () => {
            expect(
              wrapper.state().foods
            ).toEqual([]);
          });
        });

        describe('Then user press backspace', () => {
          const value = 'bro';

          beforeEach(() => {
            const input = wrapper.find('input').first();
            input.simulate('change', {
              target: { value }
            });
          });

          it('should set state property `searchValue`', () => {
            expect(
              wrapper.state().searchValue
            ).toBe(value);
          });


          it('should call again the API', () => {
            expect(
              Client.search
            ).toHaveBeenCalledTimes(3);
          });

          describe('User deleted the entire string', () => {
            const value = '';

            beforeEach(() => {
              const input = wrapper.find('input').first();
              input.simulate('change', {
                target: { value }
              });
            });

            it('should set state property `searchValue` to emtpy', () => {
              expect(
                wrapper.state().searchValue
              ).toBe('');
            });

            it('should not call the API', () => {
              expect(
                Client.search
              ).toHaveBeenCalledTimes(3);
            });

            it('should set state `foods` empty', () => {
              expect(
                wrapper.state().foods
              ).toEqual([]);
            });

            it('should not display the remove icon', () => {
              expect(
                wrapper.find('.remove.icon').length
              ).toBeFalsy();
            });

          }); // User backspace deleted all
        }); // user backspace

        describe('Then user click remove icon', () => {

          beforeEach(() => {
            const removeIcon = wrapper.find('.remove.icon').first();
            removeIcon.simulate('click');
          });

          it('should set state property `searchValue` to emtpy', () => {
            expect(
              wrapper.state().searchValue
            ).toBe('');
          });

          it('should not call the API', () => {
            expect(
              Client.search
            ).toHaveBeenCalledTimes(2);
          });

          it('should set state `foods` empty', () => {
            expect(
              wrapper.state().foods
            ).toEqual([]);
          });

          it('should not display the remove icon', () => {
            expect(
              wrapper.find('.remove.icon').length
            ).toBeFalsy();
          });

        });
      }); // User Types more
    }); // Desc API
  }); // Desc Populate
});
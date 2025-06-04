import {render,screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Products from '../components/Products'

test('Testing the product list', () => { 

  render(<Products/>)
  const h2Elements = screen.getAllByRole('heading', { level: 2 });
  expect(h2Elements.length).toBeGreaterThan(0);

 })

test('Testing for the Addbutton button',()=>{
  render(<Products/>)
  const addprdocutbutton=screen.getByText('Add Product');
  expect(addprdocutbutton).toBeInTheDocument();
})

test('Testing for Export button ',()=>{
  render(<Products/>)
  const addprdocutbutton=screen.getByText('Export to Excel');
  expect(addprdocutbutton).toBeInTheDocument();
})

test('testing for the searhbar with the placeholder',()=>{
  render(<Products/>)
  const searchbarPlaceholder=screen.getByPlaceholderText('Search....');
  expect( searchbarPlaceholder).toBeInTheDocument()
})
import Item from './Item'

const List = ({items}) => {
  return (
    <section>
      {
        items.map(item => <Item key={item.Id} {...item} />)
      }
    </section>
  )
}

export default List
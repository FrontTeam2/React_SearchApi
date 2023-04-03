const ColoredItem = ({ item, query }) => {
  return item.includes(query) ? (
    <div>
      {item.split(query)[0]}
      <span style={{ fontWeight: '900' }}>{query}</span>
      {item.split(query)[1]}
    </div>
  ) : (
    <>{item}</>
  );
};

export default ColoredItem;

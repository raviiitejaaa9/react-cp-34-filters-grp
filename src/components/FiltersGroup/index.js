import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    onChangeCategory,
    onChangeRating,
    toClearFilters,
  } = props
  // console.log(categoryOptions[0])

  const onCLickClear = () => {
    toClearFilters()
  }

  return (
    <div className="filters-group-container">
      <h1>Category</h1>
      <div className="category-list">
        {categoryOptions.map(eachItem => (
          <CategoryItem
            eachItem={eachItem}
            key={eachItem.categoryId}
            onChangeCategory={onChangeCategory}
          />
        ))}
      </div>
      <h1>Ratings</h1>
      <ul className="category-list">
        {ratingsList.map(eachItem => (
          <RatingItem
            eachRating={eachItem}
            key={eachItem.ratingId}
            onChangeRating={onChangeRating}
          />
        ))}
      </ul>

      <button type="button" className="clear-btn" onClick={onCLickClear}>
        {' '}
        Clear Filters{' '}
      </button>
    </div>
  )
}

export default FiltersGroup

const CategoryItem = props => {
  const {eachItem, onChangeCategory} = props
  const {name, categoryId} = eachItem

  const onClickCategory = () => {
    onChangeCategory(categoryId)
  }

  return (
    <p onClick={onClickCategory} className="list-btn">
      {name}
    </p>
  )
}

const RatingItem = props => {
  const {eachRating, onChangeRating} = props
  const {ratingId, imageUrl} = eachRating
  // console.log(ratingId, imageUrl)

  const onClickRating = () => {
    onChangeRating(ratingId)
  }

  return (
    <div className="list-items-ratings">
      <img
        src={imageUrl}
        onClick={onClickRating}
        alt={`rating ${ratingId}`}
        className="rating-img"
      />
      <p> & up </p>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  // Images
  const [images, setImages] = useState([false, false, false, false])

  // Product info
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [longDescription, setLongDescription] = useState("") // ✅ NEW
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState([])
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  // Categories (load from localStorage or default)
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("categories")
    return saved ? JSON.parse(saved) : {
      Men: ["Topwear", "Bottomwear", "Winterwear"],
      Women: ["Dresses", "Tops", "Skirts"],
      Kids: ["Boys", "Girls"]
    }
  })
  const [subCategoryOptions, setSubCategoryOptions] = useState([])

  // Persist categories in localStorage
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories))
  }, [categories])

  // Update subcategories when category changes
  useEffect(() => {
    if (category && categories[category]) {
      setSubCategoryOptions(categories[category])
      setSubCategory([...categories[category]]) // auto-select all
    } else {
      setSubCategoryOptions([])
      setSubCategory([])
    }
  }, [category, categories])

  // Toggle subcategory selection
  const handleSubCategoryChange = (value) => {
    setSubCategory(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    )
  }

  // Category management
  const handleAddCategory = () => {
    const newCategory = window.prompt("Enter new category name:")
    if (newCategory && !categories[newCategory]) {
      setCategories(prev => ({ ...prev, [newCategory]: [] }))
    }
  }

  const handleRenameCategory = (oldCat) => {
    const newName = window.prompt("Enter new name for category", oldCat)
    if (newName && newName !== oldCat) {
      setCategories(prev => {
        const updated = { ...prev, [newName]: prev[oldCat] }
        delete updated[oldCat]
        return updated
      })
      if (category === oldCat) setCategory(newName)
    }
  }

  const handleDeleteCategory = (cat) => {
    if (window.confirm(`Delete category "${cat}"? This will remove all its subcategories.`)) {
      setCategories(prev => {
        const updated = { ...prev }
        delete updated[cat]
        return updated
      })
      if (category === cat) {
        setCategory("")
        setSubCategory([])
      }
    }
  }

  // Subcategory management
  const handleAddSubCategory = () => {
    if (!category) return alert("Please select a category first")
    const newSub = window.prompt("Enter new subcategory name:")
    if (newSub && !categories[category].includes(newSub)) {
      setCategories(prev => ({
        ...prev,
        [category]: [...prev[category], newSub]
      }))
      setSubCategory(prev => [...prev, newSub])
    }
  }

  const handleRenameSubCategory = (sub) => {
    const newName = window.prompt("Enter new name for subcategory", sub)
    if (newName && newName !== sub) {
      setCategories(prev => ({
        ...prev,
        [category]: prev[category].map(s => s === sub ? newName : s)
      }))
      setSubCategory(prev => prev.map(s => s === sub ? newName : s))
    }
  }

  const handleDeleteSubCategory = (sub) => {
    if (window.confirm(`Delete subcategory "${sub}"?`)) {
      setCategories(prev => ({
        ...prev,
        [category]: prev[category].filter(s => s !== sub)
      }))
      setSubCategory(prev => prev.filter(s => s !== sub))
    }
  }

  // Submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("longDescription", longDescription) // ✅ NEW
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", JSON.stringify(subCategory))
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      images.forEach((img, idx) => {
        if (img) formData.append(`image${idx + 1}`, img)
      })

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        // Reset form
        setName('')
        setDescription('')
        setLongDescription('') // ✅ RESET
        setImages([false, false, false, false])
        setPrice('')
        setCategory('')
        setSubCategory([])
        setSizes([])
        setBestseller(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>

      {/* Image Upload */}
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {images.map((img, idx) => (
            <label key={idx} htmlFor={`image${idx}`}>
              <img className='w-20' src={!img ? assets.upload_area : URL.createObjectURL(img)} alt="" />
              <input onChange={(e) => {
                const file = e.target.files[0]
                setImages(prev => prev.map((i, iIdx) => iIdx === idx ? file : i))
              }} type="file" id={`image${idx}`} hidden />
            </label>
          ))}
        </div>
      </div>

      {/* Name & Description */}
      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Write content here' required />
      </div>
{/*  long description*/}
      <div className='w-full'>
        <p className='mb-2'>Product long description</p>
        <textarea onChange={(e) => setLongDescription(e.target.value)} value={longDescription} className='w-full max-w-[500px] px-3 py-2' placeholder='Write detailed content here' />
      </div>

      {/* Category & Subcategory */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        {/* Category */}
        <div>
          <p className='mb-2'>Product Category</p>

          <div className='flex gap-2'>

            <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
              <option value="">--Select Category--</option>
              {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}

            </select>

            <button type='button' onClick={handleAddCategory} className='px-2 py-1 bg-gray-200'>+ Add</button>
          </div>
          {category && (
            <div className='flex gap-2 mt-1'>
              <button type='button' onClick={() => handleRenameCategory(category)} className='px-2 py-1 bg-yellow-200'>Rename</button>
              <button type='button' onClick={() => handleDeleteCategory(category)} className='px-2 py-1 bg-red-200'>Delete</button>
            </div>
          )}
        </div>

        {/* Subcategory */}
        <div>
          <p className='mb-2'>Subcategory</p>
          <div className='flex flex-col gap-2'>
            {subCategoryOptions.map(sub => (
              <div key={sub} className='flex items-center gap-2'>
                <input type="checkbox" value={sub} checked={subCategory.includes(sub)} onChange={() => handleSubCategoryChange(sub)} />
                <span>{sub}</span>
                <button type='button' onClick={() => handleRenameSubCategory(sub)} className='px-1 py-0 bg-yellow-200 text-xs'>Rename</button>
                <button type='button' onClick={() => handleDeleteSubCategory(sub)} className='px-1 py-0 bg-red-200 text-xs'>Delete</button>
              </div>
            ))}
            <button type='button' onClick={handleAddSubCategory} className='px-2 py-1 bg-gray-200 mt-1'>+ Add</button>
          </div>
        </div>

        {/* Price */}
        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25' />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className='mb-2'>Product Sizes</p>
        <select
          multiple
          value={sizes}
          onChange={(e) => setSizes(Array.from(e.target.selectedOptions, o => o.value))}
          className='w-full max-w-[500px] px-3 py-2 border rounded'
          size={8}
        >
          {[
            "XS – Extra Small (clothing)", "S – Small (clothing)", "M – Medium (clothing)", "L – Large (clothing)", "XL – Extra Large (clothing)", "XXL – Double Extra Large (clothing)",
            "Numeric Clothing Size – 32, 34, 36, 38… (EU/US sizes)", "Age (Kids) – 0–3 months, 3–6 months, 6–12 months", "Height (Kids) – 80cm, 90cm, 100cm, 110cm",
            "Shoes (EU) – 36, 37, 38, 39…", "Shoes (US) – 5, 6, 7, 8…", "Length (cm/inches) – e.g., 100cm, 150cm", "Weight (kg/g) – 1kg, 500g, 250g", "Volume (ml/L) – 200ml, 500ml, 1L",
            "Capacity (Pieces) – pack of 6, pack of 12", "Cup Size – A, B, C, D", "Ring Size – 5, 6, 7…", "Bottle/Container Size – 250ml, 500ml, 1L", "Towel/Blanket Size – Small, Medium, Large", "One Size – Single universal size"
          ].map(size => <option key={size} value={size}>{size}</option>)}
        </select>
      </div>

      {/* Bestseller */}
      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      {/* Submit */}
      <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  )
}

export default Add

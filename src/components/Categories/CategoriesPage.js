
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from "axios";
import { TextInput, Dropdown, Button } from "flowbite-react";  // or your UI library
import { HiSearch } from "react-icons/hi";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);

  const myToken = localStorage.getItem("Token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://43.250.40.133:5005/api/v1/categories', {
          headers: {
            Authorization: `Bearer ${myToken}`,
          },
        });

        console.log('Categories:', response.data);
        const data = response.data?.data || [];
        setCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  const handleToggle = async (index, categoryId) => {
    setOpenIndex(openIndex === index ? null : index);

    if (!subcategories[categoryId]) {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://43.250.40.133:5005/api/v1/subcategories?category=${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${myToken}`,
            },
          }
        );
        setSubcategories((prev) => ({
          ...prev,
          [categoryId]: response.data?.data || [],
        }));
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        setSubcategories((prev) => ({ ...prev, [categoryId]: [] }));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = categories.filter((cat) => cat.name.toLowerCase().includes(value));
    setFilteredCategories(filtered);
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Delete category: ${categoryName}?`)) return;
    try {
      await axios.delete(`http://43.250.40.133:5005/api/v1/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${myToken}` },
      });
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      setFilteredCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      setSubcategories((prev) => {
        const updated = { ...prev };
        delete updated[categoryId];
        return updated;
      });
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId, subcategoryName) => {
    if (!window.confirm(`Delete subcategory: ${subcategoryName}?`)) return;
    try {
      await axios.delete(`http://43.250.40.133:5005/api/v1/subcategories/${subcategoryId}`, {
        headers: { Authorization: `Bearer ${myToken}` },
      });
      setSubcategories((prev) => ({
        ...prev,
        [categoryId]: prev[categoryId]?.filter((sub) => sub._id !== subcategoryId),
      }));
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      {/* Header */}
     
      <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
  <div className="flex-grow max-w-[250px]">
    <TextInput
      icon={HiSearch}
      type="text"
      placeholder="Search categories..."
      value={searchTerm}
       onChange={handleSearch}
     
    />
  </div>
  <h1 className="text-xl font-bold whitespace-nowrap">Categories</h1>
  <div className="flex items-center gap-3">
    <Dropdown label="Actions">
      <Dropdown.Item onClick={() => alert("Export to Excel feature coming soon!")}>Export</Dropdown.Item>
    <Dropdown.Item onClick={() => alert("Import to Excel feature coming soon!")}>Import</Dropdown.Item>

    </Dropdown>
    <Button color="blue" onClick={() => navigate("/add-category")}>+ Add Category</Button>
    <Button color="blue" onClick={() => navigate("/subcategories")}>+ Add SubCategories</Button>
  </div>
</div>


    

      {/* Category List */}
      <div className="bg-white border rounded-md shadow-sm">
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No categories found.</div>
        ) : (
          filteredCategories.map((item, index) => (
            <div key={item._id || index} className="border-b hover:bg-gray-50 transition">
              <div className="flex justify-between items-center px-4 py-3 cursor-pointer" onClick={() => handleToggle(index, item._id)}>
                <div className="flex gap-4 items-center">
                  <span className="font-semibold">{index + 1}.</span>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                    <span className="sr-only">Open options</span>
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                    </svg>
                  </Menu.Button>

                  <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => navigate(`/edit-category/${item._id}`)}
                            className={`${active ? 'bg-gray-100' : ''
                              } group flex items-center w-full px-3 py-2 text-sm text-gray-800`}
                          >
                            ✏️ Edit
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(item._id, item.name);
                            }}
                            className={`${active ? 'bg-red-100' : ''
                              } group flex items-center w-full px-3 py-2 text-sm text-red-600`}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>

              </div>

              {/* Subcategories */}
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700">
                  <p className="mb-2">
                    <strong>Description:</strong> {item.description || "N/A"}
                  </p>
                  <div className="mt-2">
                    <strong>Subcategories:</strong>
                    {loading && !subcategories[item._id] ? (
                      <p className="text-sm text-gray-500">Loading...</p>
                    ) : subcategories[item._id]?.length > 0 ? (
                      <table className="w-full text-sm text-left mt-2 border border-gray-300">
                        <thead className="bg-blue-100">
                          <tr>
                            <th className="px-4 py-2 border-b">s.no</th>
                            <th className="px-4 py-2 border-b">Name</th>
                            <th className="px-4 py-2 border-b">Description</th>
                            <th className="px-4 py-2 border-b">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subcategories[item._id].map((sub, i) => (
                            <tr key={sub._id || i} className="hover:bg-gray-50">
                              <td className="px-4 py-2 border-b">{i + 1}</td>
                              <td className="px-4 py-2 border-b">{sub.name}</td>
                              <td className="px-4 py-2 border-b">{sub.description}</td>
                              <td className="px-4 py-2 border-b text-right">
                                <Menu as="div" className="relative inline-block text-center">
                                  <Menu.Button className="p-2 hover:bg-gray-200 rounded-full">
                                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                                  </Menu.Button>
                                  <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                    <div className="py-1">
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            onClick={() => navigate(`/edit-subcategory/${sub._id}`)}
                                            className={`${active ? 'bg-gray-100' : ''
                                              } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                          >
                                            <PencilSquareIcon className="w-4 h-4 mr-2" />
                                            Edit
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            onClick={() => handleDeleteSubcategory(item._id, sub._id, sub.name)}
                                            className={`${active ? 'bg-gray-100' : ''
                                              } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                                          >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Delete
                                          </button>
                                        )}
                                      </Menu.Item>
                                    </div>
                                  </Menu.Items>
                                </Menu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-sm text-gray-500">No subcategories found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;























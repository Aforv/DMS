import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import { Drawer } from "flowbite-react";

import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';


const NestedCategoriesWithPath = () => {
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  
  const [categoryTree, setCategoryTree] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [parentPath, setParentPath] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState({ name: "", description: "" });
  const [addingChild, setAddingChild] = useState(false);
  const [collapsedNodeIds, setCollapsedNodeIds] = useState(new Set());

const toggleCollapse = (id,e) => {
  setCollapsedNodeIds((prev) => {
    const updated = new Set(prev);
      if (updated.has(id)) {
      updated.delete(id); // expand
    } else {
      updated.add(id); // collapse
    }
    return updated;
  });
};

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("categoryTree");
    if (stored) {
      setCategoryTree(JSON.parse(stored));
    } else {
      setCategoryTree({
        id: "root",
        name: "Root Category",
        description: "This is the base of your category tree",
        children: [],
      });
    }
  }, []);

  // Save to localStorage on tree update
  useEffect(() => {
    if (categoryTree) {
      localStorage.setItem("categoryTree", JSON.stringify(categoryTree));
    }
  }, [categoryTree]);

  // Recursive render function
 const renderNode = (node) => {
  const isCollapsed = collapsedNodeIds.has(node.id);

  return (
    <div key={node.id} className="mb-2">
      <div  onClick={() => {
        toggleCollapse(node.id);
        }}
 className="flex justify-between items-center bg-white-100 p-3 rounded shadow-sm hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-2">
        {node.children?.length > 0 && (
            <button
              className="text-lg font-bold focus:outline-none"
              title={isCollapsed ? "Expand" : "Collapse"}
               >
              {isCollapsed ? "▶" : "▼"}
            </button>
          )}
          <div>
            
            <h4 className="font-semibold">{node.name}</h4>
            {node.description && (
              <p className="text-sm text-gray-600">{node.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">

        <Button size="xs" onClick={(e) =>{            e.stopPropagation(); // Prevent toggle on button click
 handleAddChild(node.id)}} title="Add Subcategory">
          +
        </Button>
  <Menu as="div" className="relative">
    <Menu.Button
      onClick={(e) => e.stopPropagation()}
      className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
    >
      <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
    </Menu.Button>

    <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
      <div className="p-1">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => navigate(`/edit-subcategory/${"683e84becd8387637ff7e7dd"}`)} // Replace with actual ID
              className={`${active ? 'bg-gray-100' : ''} flex items-center w-full px-3 py-2 text-sm text-gray-800`}
            >
              <PencilSquareIcon className="w-4 h-4 mr-2" />
              Edit
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${active ? 'bg-red-100' : ''} flex items-center w-full px-3 py-2 text-sm text-red-600`}
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete
            </button>
          )}
        </Menu.Item>
      </div>
    </Menu.Items>
  </Menu>
        </div>
      </div>
    

      {!isCollapsed && node.children?.length > 0 && (
        <div className="ml-4 mt-2 border-l-2 pl-4 border-gray-300">
          {node.children.map((child) => renderNode(child))}
        </div>
      )}
    </div>
  );
};


  // Find a node by ID and return path to it
  const findNodeAndPath = (node, id, path = []) => {
    if (node.id === id) return { node, path: [...path, node] };
    for (let child of node.children || []) {
      const result = findNodeAndPath(child, id, [...path, node]);
      if (result) return result;
    }
    return null;
  };

  // On "+" click: set path + open modal
  const handleAddChild = (parentId) => {
    const result = findNodeAndPath(categoryTree, parentId);
    if (result) {
      setActiveNodeId(parentId);
      setParentPath(result.path);
      setNewSubcategory({ name: "", description: "" });
      setAddingChild(true);
    }
  };

  // Add the new subcategory to the tree
  const handleAddSubmit = () => {
    if (!newSubcategory.name.trim()) {
      alert("Please enter a name");
      return;
    }

    const newNode = {
      id: Date.now().toString(),
      name: newSubcategory.name.trim(),
      description: newSubcategory.description.trim(),
      children: [],
    };

    const updateTree = (node) => {
      if (node.id === activeNodeId) {
        node.children = [...(node.children || []), newNode];
        return true;
      }
      for (let child of node.children || []) {
        if (updateTree(child)) return true;
      }
      return false;
    };

    const clonedTree = JSON.parse(JSON.stringify(categoryTree));
    updateTree(clonedTree);
    setCategoryTree(clonedTree);
    setAddingChild(false);
  };

  if (!categoryTree) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Category Hierarchy</h2>
      {renderNode(categoryTree)}

      {/* Drawer for adding subcategory */}
{addingChild && (
  <div
    className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40"
    onClick={(e) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target)
      ) {
        setAddingChild(false); // Close when clicked outside
      }
    }}
  >
    <div
      ref={drawerRef}
      className="h-full w-full sm:w-[480px] bg-white p-6 shadow-lg transform transition-transform duration-300"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add Subcategory</h3>
        <button
          onClick={() => setAddingChild(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <strong>Parent Path:</strong>
          <div className="flex flex-wrap gap-1 mt-1 text-sm">
            {parentPath.map((node, index) => (
              <span key={node.id} className="bg-gray-200 px-2 py-1 rounded">
                {node.name}
                {index < parentPath.length - 1 && " / "}
              </span>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="name" value="Name" />
          <TextInput
            id="name"
            value={newSubcategory.name}
            onChange={(e) =>
              setNewSubcategory((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="Subcategory name"
          />
        </div>

        <div>
          <Label htmlFor="description" value="Description" />
          <TextInput
            id="description"
            value={newSubcategory.description}
            onChange={(e) =>
              setNewSubcategory((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Description"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button color="gray" onClick={() => setAddingChild(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddSubmit}>Add</Button>
        </div>
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default NestedCategoriesWithPath;

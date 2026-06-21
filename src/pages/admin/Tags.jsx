import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createTag, deleteTag, fetchTags } from "../../api/content";

const Tags = () => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const { data: tags, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const createMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
      setName("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name });
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Управління тегами</h2>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Назва нового тегу"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          {createMutation.isPending ? "Додавання..." : "Додати"}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <div
            key={tag._id}
            className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span className="text-gray-800">{tag.name}</span>
            <button
              onClick={() => {
                if (window.confirm("Видалити цей тег?")) {
                  deleteMutation.mutate(tag._id);
                }
              }}
              className="text-gray-400 hover:text-red-500 font-bold"
            >
              ×
            </button>
          </div>
        ))}
        {tags?.length === 0 && <p className="text-gray-500">Тегів ще немає</p>}
      </div>
    </div>
  );
};

export default Tags;

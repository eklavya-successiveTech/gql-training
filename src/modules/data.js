export let users = [
  { id: "1", name: "John Doe", email: "john@example.com", posts: [] },
  { id: "2", name: "Jane Smith", email: "jane@example.com", posts: [] },
];

export let posts = [
  {
    id: "1",
    title: "Hello World",
    content: "This is a blog post",
    author: "1", 
    comments: [],
  },
];

export let comments = [
  { id: "101", content: "Nice post!", author: "1", postId: "1" },
];

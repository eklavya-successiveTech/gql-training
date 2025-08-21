export const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Full-stack developer passionate about clean code and modern web technologies.'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    bio: 'Tech writer and blogger sharing insights on software development and productivity.'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    bio: 'Frontend enthusiast with a love for React and GraphQL. Building the future of web.'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    bio: 'DevOps engineer and open-source contributor. Automating all the things!'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    bio: 'Mobile app developer exploring the intersection of AI and mobile technology.'
  }
];

export const posts = [
  {
    id: '1',
    title: 'Getting Started with GraphQL',
    content: 'GraphQL is a powerful query language that allows you to fetch exactly what you need. In this comprehensive guide, we\'ll explore the fundamentals of GraphQL, including schemas, queries, mutations, and best practices for building scalable APIs.',
    authorId: '1',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Building Modern React Applications',
    content: 'React has evolved significantly over the years. This post covers the latest patterns and best practices for building modern React applications, including hooks, context API, and performance optimization techniques.',
    authorId: '2',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: '3',
    title: 'The Future of Web Development',
    content: 'As we move forward, web development continues to evolve rapidly. This article discusses emerging trends, new frameworks, and technologies that are shaping the future of web development.',
    authorId: '1',
    createdAt: '2024-02-01T09:45:00Z'
  },
  {
    id: '4',
    title: 'Mastering Apollo Server',
    content: 'Apollo Server provides a robust foundation for GraphQL APIs. Learn how to set up, configure, and optimize Apollo Server for production environments with real-world examples.',
    authorId: '3',
    createdAt: '2024-02-05T16:20:00Z'
  },
  {
    id: '5',
    title: 'DevOps Best Practices',
    content: 'Implementing effective DevOps practices can significantly improve your development workflow. This guide covers CI/CD pipelines, infrastructure as code, and monitoring strategies.',
    authorId: '4',
    createdAt: '2024-02-10T11:30:00Z'
  },
  {
    id: '6',
    title: 'Mobile Development Trends 2024',
    content: 'The mobile development landscape is constantly changing. Explore the latest trends, frameworks, and technologies that are defining mobile app development in 2024.',
    authorId: '5',
    createdAt: '2024-02-12T13:45:00Z'
  },
  {
    id: '7',
    title: 'Advanced JavaScript Concepts',
    content: 'Deep dive into advanced JavaScript concepts including closures, prototypes, async/await patterns, and functional programming principles that every developer should master.',
    authorId: '2',
    createdAt: '2024-02-15T08:20:00Z'
  }
];

export const comments = [
  {
    id: '1',
    content: 'Great introduction to GraphQL! This really helped me understand the core concepts.',
    postId: '1',
    authorId: '2',
    createdAt: '2024-01-15T12:00:00Z'
  },
  {
    id: '2',
    content: 'I love how GraphQL solves the over-fetching problem. Thanks for the clear explanation!',
    postId: '1',
    authorId: '3',
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '3',
    content: 'The React hooks section was particularly insightful. Looking forward to implementing these patterns.',
    postId: '2',
    authorId: '4',
    createdAt: '2024-01-20T16:45:00Z'
  },
  {
    id: '4',
    content: 'Excellent article! The performance optimization tips are gold.',
    postId: '2',
    authorId: '1',
    createdAt: '2024-01-21T10:15:00Z'
  },
  {
    id: '5',
    content: 'Very forward-thinking perspective on web development. The section on WebAssembly was eye-opening.',
    postId: '3',
    authorId: '5',
    createdAt: '2024-02-01T11:20:00Z'
  },
  {
    id: '6',
    content: 'As someone new to Apollo Server, this guide is incredibly helpful. Thank you!',
    postId: '4',
    authorId: '2',
    createdAt: '2024-02-05T18:10:00Z'
  },
  {
    id: '7',
    content: 'The CI/CD pipeline examples are exactly what I needed for my current project.',
    postId: '5',
    authorId: '1',
    createdAt: '2024-02-10T15:45:00Z'
  },
  {
    id: '8',
    content: 'Great insights on mobile trends. React Native vs Flutter comparison was spot on.',
    postId: '6',
    authorId: '3',
    createdAt: '2024-02-12T20:30:00Z'
  },
  {
    id: '9',
    content: 'The closure examples really clarified some concepts I was struggling with.',
    postId: '7',
    authorId: '4',
    createdAt: '2024-02-15T09:15:00Z'
  },
  {
    id: '10',
    content: 'Bookmarking this for future reference. Comprehensive coverage of advanced JS topics!',
    postId: '7',
    authorId: '5',
    createdAt: '2024-02-15T12:40:00Z'
  },
  {
    id: '11',
    content: 'Could you elaborate more on the schema stitching part? That would be really helpful.',
    postId: '1',
    authorId: '4',
    createdAt: '2024-01-16T08:45:00Z'
  },
  {
    id: '12',
    content: 'This convinced me to migrate our REST API to GraphQL. The benefits are clear.',
    postId: '1',
    authorId: '5',
    createdAt: '2024-01-16T14:20:00Z'
  }
];
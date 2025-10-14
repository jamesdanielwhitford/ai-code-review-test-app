
"use client";

import { useEffect, useState } from "react";

// Mock User type
interface User {
  id: number;
  name: string;
}

// Mock Card components for demonstration purposes
const Card = ({ children }: { children: React.ReactNode }) => (
  <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '16px', maxWidth: '400px' }}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px' }}>
    {children}
  </div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{children}</h2>
);

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <div style={{ color: '#666', fontSize: '0.9rem' }}>{children}</div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
    <div style={{ paddingTop: '8px' }}>{children}</div>
);


export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);

  // This useEffect hook contains an infinite loop bug
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data.slice(0, 3)));
  }, [users]); // Incorrect dependency array causes re-renders

  return (
    <div>
      <h1>Dashboard</h1>
      <Card>
        {/* This section has an improper HTML structure */}
        <CardHeader>
            <CardTitle>Last 3 users</CardTitle>
            <CardDescription>
                {users.map((user) => (
                    <div key={user.id}>{user.name}</div>
                ))}
            </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

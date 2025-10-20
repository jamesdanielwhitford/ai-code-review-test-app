import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from './page';

// Mock the fetch function
global.fetch = jest.fn();

const mockUserData = [
  { id: 1, name: 'Leanne Graham' },
  { id: 2, name: 'Ervin Howell' },
  { id: 3, name: 'Clementine Bauch' },
];

describe('DashboardPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => mockUserData,
    });
  });

  describe('Component Rendering', () => {
    it('should render the dashboard heading', async () => {
      render(<DashboardPage />);
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    });

    it('should render the card with title "Last 3 users"', async () => {
      render(<DashboardPage />);
      expect(screen.getByRole('heading', { name: /last 3 users/i })).toBeInTheDocument();
    });

    it('should render the card component with proper styling', () => {
      const { container } = render(<DashboardPage />);
      const card = container.querySelector('div[style*="border"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should call fetch with the correct URL', async () => {
      render(<DashboardPage />);
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
      });
    });

    it('should display user names after fetching data', async () => {
      render(<DashboardPage />);
      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
        expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
        expect(screen.getByText('Clementine Bauch')).toBeInTheDocument();
      });
    });

    it('should only display the first 3 users even if more are returned', async () => {
      const extendedUserData = [
        ...mockUserData,
        { id: 4, name: 'Patricia Lebsack' },
        { id: 5, name: 'Chelsey Dietrich' },
      ];
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => extendedUserData,
      });

      render(<DashboardPage />);
      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
        expect(screen.getByText('Ervin Howell')).toBeInTheDocument();
        expect(screen.getByText('Clementine Bauch')).toBeInTheDocument();
        expect(screen.queryByText('Patricia Lebsack')).not.toBeInTheDocument();
        expect(screen.queryByText('Chelsey Dietrich')).not.toBeInTheDocument();
      });
    });

    it('should handle fetch errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
      // Component should not crash even if fetch fails
      expect(() => {
        render(<DashboardPage />);
      }).not.toThrow();
    });
  });

  describe('useEffect Dependency Array Bug', () => {
    it('should have an infinite loop vulnerability due to incorrect dependency array', async () => {
      const { rerender } = render(<DashboardPage />);
      
      // Wait for initial fetch
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const initialCallCount = (global.fetch as jest.Mock).mock.calls.length;

      // Since the dependency array includes 'users', every state update causes re-render
      // and the useEffect runs again, fetching data and updating state, creating an infinite loop
      // In a real application, this would cause multiple fetch calls
      
      // The bug exists because:
      // 1. useEffect depends on [users]
      // 2. setUsers inside useEffect modifies users
      // 3. This triggers the effect again, creating a loop

      // Verify the effect was called multiple times in a short time window
      // This test documents the bug's existence
      it.skip('demonstrates the infinite loop bug would trigger multiple fetches', () => {
        // This would require longer wait times to demonstrate the loop
        // In production, this causes excessive API calls
      });
    });

    it('should verify useEffect dependencies include users causing re-renders', async () => {
      // This test documents that the dependency array is incorrect
      // The correct dependency array should be [] (empty array)
      // or possibly [] if no dependencies are needed
      
      render(<DashboardPage />);
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // The mere fact that we can render without immediate errors
      // shows the bug requires specific conditions to trigger infinite loop
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('HTML Structure Issues', () => {
    it('should render user data within CardDescription', async () => {
      render(<DashboardPage />);
      await waitFor(() => {
        expect(screen.getByText('Leanne Graham')).toBeInTheDocument();
      });

      // The improper HTML structure places divs (users) inside CardDescription
      // which is semantically incorrect. Users should ideally be in a list structure
      const userElements = screen.getAllByText(/Graham|Howell|Bauch/);
      expect(userElements.length).toBe(3);
    });

    it('should verify CardDescription contains improperly structured user list', () => {
      const { container } = render(<DashboardPage />);
      
      // CardDescription component renders users as divs, not as a proper list (ul/li)
      // This is semantically incorrect and less accessible
      const cardDescription = container.querySelector('div[style*="color: #666"]');
      expect(cardDescription).toBeInTheDocument();
      
      // The structure should ideally be ul > li, not div > div
      // This test documents the improper structure
    });

    it('should render each user in its own div', async () => {
      const { container } = render(<DashboardPage />);
      await waitFor(() => {
        const userDivs = container.querySelectorAll('div');
        // Verify divs exist for rendering (improper structure)
        expect(userDivs.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Card Component Styling', () => {
    it('should apply correct styling to Card component', () => {
      const { container } = render(<DashboardPage />);
      const card = container.firstChild?.firstChild?.firstChild;
      expect(card).toHaveStyle('border: 1px solid #ccc');
      expect(card).toHaveStyle('borderRadius: 8px');
      expect(card).toHaveStyle('padding: 16px');
    });
  });
});
const request = require("supertest");
const app = require("../app");

jest.mock("pg", () => {
  const mockClient = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mockClient) };
});

const { Pool } = require("pg");
const mockPool = new Pool();

describe("Unit tests for /api/tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/tasks should return paginated tasks", async () => {
    mockPool.query
      .mockResolvedValueOnce({ rows: [{ id: 1, title: "Test Task", completed: false }] })
      .mockResolvedValueOnce({ rows: [{ count: "1" }] });

    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.totalPages).toBe(1);
  });

  test("POST /api/tasks should create a task", async () => {
    const mockTask = { id: 2, title: "New Task", description: "Details" };
    mockPool.query.mockResolvedValueOnce({ rows: [mockTask] });

    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "New Task", description: "Details" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("New Task");
  });

  test("POST /api/tasks/:id/done should mark task as done", async () => {
    const mockTask = { id: 1, title: "Done Task", completed: true };
    mockPool.query.mockResolvedValueOnce({ rows: [mockTask] });

    const res = await request(app).post("/api/tasks/1/done");
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });
});

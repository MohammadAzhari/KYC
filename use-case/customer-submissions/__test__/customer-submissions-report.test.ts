import { CustomerSubmissionStatus } from "@prisma/client";
import customerSubmissionDao from "../../../dao/customer-submission.dao";
import usersDao from "../../../dao/users.dao";
import customerSubmissionsReport from "../customer-submissions-report";

jest.mock("../../../dao/users.dao");
jest.mock("../../../dao/customer-submission.dao");

const mockCountUsers = usersDao.countUsers as jest.Mock;
const mockAggregateCustomerSubmissions =
  customerSubmissionDao.aggregateCustomerSubmissions as jest.Mock;

describe("customer submissions resport", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("test with success", async () => {
    const aggregatedStatueses: {
      status: CustomerSubmissionStatus;
      _count: {
        status: number;
      };
    }[] = [
      {
        status: CustomerSubmissionStatus.APPROVED,
        _count: {
          status: 5,
        },
      },
      {
        status: CustomerSubmissionStatus.PENDING,
        _count: {
          status: 3,
        },
      },
      {
        status: CustomerSubmissionStatus.REJECTED,
        _count: {
          status: 2,
        },
      },
    ];
    const numOfUsers = 12;

    mockAggregateCustomerSubmissions.mockResolvedValue(aggregatedStatueses);
    mockCountUsers.mockResolvedValue(numOfUsers);

    const expectedResult = {
      totalSubmissions: 10,
      statuses: [
        {
          count: 5,
          status: CustomerSubmissionStatus.APPROVED,
        },
        {
          count: 3,
          status: CustomerSubmissionStatus.PENDING,
        },
        {
          count: 2,
          status: CustomerSubmissionStatus.REJECTED,
        },
      ],
      totalUsers: numOfUsers,
    };

    const result = await customerSubmissionsReport();
    expect(result).toEqual(expectedResult);

    expect(mockCountUsers).toHaveBeenCalledTimes(1);
    expect(mockAggregateCustomerSubmissions).toHaveBeenCalledTimes(1);
  });
});

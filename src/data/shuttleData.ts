export interface ShuttleInfo {
  id: number;
  departureTime: string;
}

export type ShuttleDirection = 'TO_SCHOOL' | 'FROM_SCHOOL';

export interface ExtendedShuttleInfo extends ShuttleInfo {
  routeName: 'BAEKSEOK' | 'SAMSONG' | 'SAMSONG_WITH_WONHEUNG';
  shuttleDirection: ShuttleDirection;
}

export const allShuttles: ExtendedShuttleInfo[] = [
  { "id": 1, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:20" },
  { "id": 2, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:25" },
  { "id": 3, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:30" },
  { "id": 4, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:40" },
  { "id": 5, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:00" },
  { "id": 6, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:20" },
  { "id": 7, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:25" },
  { "id": 8, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:30" },
  { "id": 9, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "10:00" },
  { "id": 10, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "10:15" },
  { "id": 11, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "10:25" },
  { "id": 12, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "11:00" },
  { "id": 13, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "12:00" },
  { "id": 14, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "14:00" },
  { "id": 15, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "11:20" },
  { "id": 16, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "13:20" },
  { "id": 17, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "14:20" },
  { "id": 18, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "15:20" },
  { "id": 19, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "16:20" },
  { "id": 20, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "16:30" },
  { "id": 21, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:00" },
  { "id": 22, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:20" },
  { "id": 23, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:30" },
  { "id": 24, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "18:20" },
  { "id": 25, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:20" },
  { "id": 26, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:35" },
  { "id": 27, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:40" },
  { "id": 28, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:00" },
  { "id": 29, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:10" },
  { "id": 30, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:30" },
  { "id": 31, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "10:10" },
  { "id": 32, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "10:30" },
  { "id": 33, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "11:20" },
  { "id": 34, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "13:20" },
  { "id": 35, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "14:20" },
  { "id": 36, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "15:20" },
  { "id": 37, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "12:20" },
  { "id": 38, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "13:20" },
  { "id": 39, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "14:20" },
  { "id": 40, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "15:20" },
  { "id": 41, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "16:00" },
  { "id": 42, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "16:20" },
  { "id": 43, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:00" },
  { "id": 44, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:20" },
  { "id": 45, "routeName": "SAMSONG_WITH_WONHEUNG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:30" },
  { "id": 46, "routeName": "SAMSONG_WITH_WONHEUNG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "18:10" },
  { "id": 47, "routeName": "SAMSONG_WITH_WONHEUNG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "18:20" },
  { "id": 48, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "19:20" },
]; 
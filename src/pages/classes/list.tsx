import { useEffect, useMemo, useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { ClassDetails, Subject, User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useList } from "@refinedev/core";
import { ShowButton } from "@/components/refine-ui/buttons/show";

const ClassesList = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { pageSize: 100 },
  });

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: { pageSize: 100 },
  });

  const subjects = useMemo(
    () => subjectsQuery?.data?.data ?? [],
    [subjectsQuery?.data?.data],
  );
  const teachers = useMemo(
    () => teachersQuery?.data?.data ?? [],
    [teachersQuery?.data?.data],
  );
  const subjectsLoading = subjectsQuery.isLoading;
  const teachersLoading = teachersQuery.isLoading;

  const subjectOptions = useMemo(
    () =>
      subjects.map((subject) => ({ label: subject.name, value: subject.id })),
    [subjects],
  );

  const teacherOptions = useMemo(
    () =>
      teachers.map((teacher) => ({ label: teacher.name, value: teacher.id })),
    [teachers],
  );

  const subjectFilters = useMemo(
    () =>
      selectedSubject === "all"
        ? []
        : [
            {
              field: "subjectId",
              operator: "eq" as const,
              value: selectedSubject,
            },
          ],
    [selectedSubject],
  );

  const teacherFilters = useMemo(
    () =>
      selectedTeacher === "all"
        ? []
        : [
            {
              field: "teacherId",
              operator: "eq" as const,
              value: selectedTeacher,
            },
          ],
    [selectedTeacher],
  );

  const searchFilters = useMemo(
    () =>
      searchQuery
        ? [
            {
              field: "name",
              operator: "contains" as const,
              value: searchQuery,
            },
          ]
        : [],
    [searchQuery],
  );

  const classColumns = useMemo<ColumnDef<ClassDetails>[]>(
    () => [
      {
        id: "bannerUrl",
        accessorKey: "bannerUrl",
        size: 80,
        header: () => <p className="column-title ml-2">Banner</p>,
        cell: ({ getValue }) => (
          <div className="flex items-center justify-center ml-2">
            <img
              src={getValue<string>() || "/placeholder-class.png"}
              alt="Class Banner"
              className="w-10 h-10 rounded object-cover"
            />
          </div>
        ),
      },
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title">Class Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground font-medium">
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        size: 100,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge variant={status === "active" ? "default" : "secondary"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        id: "subject",
        accessorKey: "subject.name",
        size: 150,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        size: 150,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "capacity",
        accessorKey: "capacity",
        size: 100,
        header: () => <p className="column-title">Capacity</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<number>()}</span>
        ),
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="classes"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const classTable = useTable<ClassDetails>({
    columns: classColumns,
    refineCoreProps: {
      resource: "classes",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [...subjectFilters, ...teacherFilters, ...searchFilters],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p className="text-muted-foreground my-auto">
          Manage your classes, subjects, and teachers.
        </p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={subjectsLoading}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedTeacher}
              onValueChange={setSelectedTeacher}
              disabled={teachersLoading}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teacherOptions.map((teacher) => (
                  <SelectItem key={teacher.value} value={teacher.value}>
                    {teacher.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={classTable} />
    </ListView>
  );
};

export default ClassesList;

"use server";

import pool from "@/database/config";
import { ApiResponseType } from "@/model/response";
import { errorToString } from "@/utils/methods";

interface GetAllCourseAmountPayload {}

const GetAllCourseAmount = async (
  payload: GetAllCourseAmountPayload
): Promise<ApiResponseType<any | null>> => {
  try {
    const result = await pool.query(
      `SELECT tb_course_amount.*, tb_agent.Id AS tb_agentId, tb_agent.agentCorpName, tb_crs.Id AS tb_crsId, tb_crs.name, tb_vhcl.Id AS tb_vhclId, tb_vhcl.makeModel, tb_vhcl.vhclNo FROM tb_course_amount  LEFT JOIN tb_agent ON tb_course_amount.agentId = tb_agent.Id LEFT JOIN tb_crs ON tb_course_amount.courseId = tb_crs.Id LEFT JOIN tb_vhcl ON tb_course_amount.vehicleId = tb_vhcl.Id;`
    );
    const rows = result[0];

    return {
      status: true,
      data: rows,
      message: "Course Amount data get successfully",
      functionname: "GetAllCourseAmount",
    };
  } catch (e) {
    const response: ApiResponseType<null> = {
      status: false,
      data: null,
      message: errorToString(e),
      functionname: "GetAllCourseAmount",
    };
    return response;
  }
};

export default GetAllCourseAmount;

using Pay2Me.Data.Common;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;

namespace Pay2Me.Data.Helpers
{
    public partial class Sp
    {
        public static string Cs { get; set; }

        public Sp()
        {

        }

        public async Task<Result<string>> Exec(dynamic model, string spName)
        {
            return await this.Exec(model, spName, null);
        }
        public async Task<Result<string>> Exec(dynamic model, string spName, int? loggedInUserId)
        {
            var result = new Result<string>();
            try
            {
                string query = $"EXEC {spName} ";
                if (model is not null)
                {
                    dynamic data = JsonConvert.DeserializeObject<dynamic>(model.ToString());
                    foreach (dynamic item in data)
                    {
                        string name = item.Name;
                        string value = item.Value;
                        if (!string.IsNullOrEmpty(value))
                            query += $"@{name}='{value.Replace("'", "''")}',";
                        else
                            query += $"@{name}='',";
                    }
                }
                if (loggedInUserId > 0)
                {
                    query += $"@LogInUserId='{loggedInUserId}'";
                }

                // Remove the trailing comma from the query string
                query = query.TrimEnd(',');
                result = await RAS(query);
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
                result.success = false;
            }
            return result;
        }


        public async Task<Result<dynamic>> Single(string value, string spName)
        {
            var result = new Result<dynamic>();
            try
            {
                string query = string.Empty;
                if (!string.IsNullOrEmpty(value))
                    query = $"EXEC {spName} '{value.Replace("'", "''")}'";
                else
                    query = $"EXEC {spName}";

                result = await RAD(query);
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
                result.success = false;
            }
            return result;
        }

        //result as string
        public async Task<Result<string>> RAS(string spName)
        {
            var result = new Result<string>();
            try
            {
                using (SqlConnection Connection = new SqlConnection(Cs))
                {
                    await Connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand(spName, Connection))
                    {
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (reader.HasRows)
                            {
                                var dataTable = new DataTable();
                                dataTable.Load(reader);
                                foreach (DataColumn column in dataTable.Columns)
                                    column.ColumnName = column.ColumnName.ToLower();
                                result.data = JsonConvert.SerializeObject(dataTable);
                            }
                        }
                    }
                    result.success = true;
                    await Connection.CloseAsync();
                }
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
                result.success = false;
            }
            return result;
        }


        //result as parameter
        public async Task<string> RAP(string spName)
        {
            string result = string.Empty;
            try
            {
                using (SqlConnection Connection = new SqlConnection(Cs))
                {
                    await Connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand(spName, Connection))
                    {
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (reader.HasRows)
                            {
                                var dt = new DataTable();
                                dt.Load(reader);
                                if (dt.Rows.Count > 0)
                                    result = dt.Rows[0].Field<string>(0);
                            }
                        }
                    }
                    await Connection.CloseAsync();
                }
            }
            catch (Exception ex)
            {
                //  await _errorLogService.LogException(ex);
            }
            return result;
        }

        //Execution with Type and result as string
        public async Task<string> ExecWithType(string spName, DataTable data, string parameterName, string TypeName)
        {
            string result = string.Empty;
            try
            {
                using (var con = new SqlConnection(Cs))
                {
                    con.Open();

                    using (SqlCommand cmd = new SqlCommand("exec " + spName + " @" + parameterName, con))
                    {
                        var pList = new SqlParameter("@" + parameterName, SqlDbType.Structured);
                        pList.TypeName = "dbo." + TypeName;
                        pList.Value = data;

                        cmd.Parameters.Add(pList);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            if (reader.HasRows)
                            {
                                var dt = new DataTable();
                                dt.Load(reader);
                                if (dt.Rows.Count > 0)
                                    result = dt.Rows[0].Field<string>(0);
                            }
                        }
                    }
                    await con.CloseAsync();
                }
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }
            return result;
        }

        public async Task<Result<dynamic>> ExecTableWithIp(dynamic model, string spName, string? IP)
        {
            return await this.ExecTableWithIp(model, spName, null, IP);
        }
        public async Task<Result<dynamic>> ExecTable(dynamic model, string spName)
        {
            return await this.ExecTable(model, spName, null);
        }
        public async Task<Result<dynamic>> ExecTable(dynamic model, string spName, int? loggedInUserId)
        {
            var result = new Result<dynamic>();
            try
            {
                string query = $"EXEC {spName} ";
                if (model is not null)
                {
                    dynamic data = JsonConvert.DeserializeObject<dynamic>(model.ToString());
                    foreach (dynamic item in data)
                    {
                        string name = item.Name;
                        string value = item.Value;
                        if (!string.IsNullOrEmpty(value))
                            query += $"@{name}=N'{value.Replace("'", "''")}',";
                        else
                            query += $"@{name}='',";
                    }
                }
                if (loggedInUserId > 0)
                {
                    query += $"@LogInUserId='{loggedInUserId}'";
                }
                
                // Remove the trailing comma from the query string
                query = query.TrimEnd(',');
                result = await RAD(query);
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
                result.success = false;
            }
            return result;
        }
        public async Task<Result<dynamic>> ExecTableWithIp(dynamic model, string spName, int? loggedInUserId, string? IP)
        {
            var result = new Result<dynamic>();
            try
            {
                string query = $"EXEC {spName} ";
                if (model is not null)
                {
                    dynamic data = JsonConvert.DeserializeObject<dynamic>(model.ToString());
                    foreach (dynamic item in data)
                    {
                        string name = item.Name;
                        string value = item.Value;
                        if (!string.IsNullOrEmpty(value))
                            query += $"@{name}=N'{value.Replace("'", "''")}',";
                        else
                            query += $"@{name}='',";
                    }
                }
                if (loggedInUserId > 0)
                {
                    query += $"@LogInUserId='{loggedInUserId}'";
                }
                if (IP is not null)
                {
                    query += $"@IpAddress='{IP}',";
                }

                // Remove the trailing comma from the query string
                query = query.TrimEnd(',');
                result = await RAD(query);
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
                result.success = false;
            }
            return result;
        }


        //result as datatable
        public async Task<Result<dynamic>> RAD(string spName)
        {
            var result = new Result<dynamic>();
            try
            {
                using (SqlConnection Connection = new SqlConnection(Cs))
                {
                    await Connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand(spName, Connection))
                    {
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            //if (reader.HasRows)
                            //{
                                var dataTable = new DataTable();
                                dataTable.Load(reader);
                                foreach (DataColumn column in dataTable.Columns)
                                    column.ColumnName = column.ColumnName.ToLower();

                                result.message = dataTable.Columns[0].ColumnName == "flag" ? dataTable.Rows[0][0].ToString() : "Request executed successfully!";
                                result.success = dataTable.Columns[1].ColumnName == "success" ? (dataTable.Rows[0][1].ToString() == "0" ? false : true) : true;

                                result.data = result.success == false ? null : dataTable;
                            //}
                        }
                    }
                    //result.success = true;
                    await Connection.CloseAsync();
                }
            }
            catch (Exception ex)
            {
                result.message = ex.Message;
                result.success = false;
            }
            return result;
        }
    }
}

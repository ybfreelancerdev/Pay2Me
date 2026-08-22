
namespace Pay2Me.Data.Common
{
    public class Result<T> where T : class
    {
        public Result() { }

        public Result(bool success)
        {
            this.success = success;
        }

        public Result(bool success, string Message)
        {
            this.success = success;
            this.message = Message;
        }

        public Result(bool success, string Message, T state)
        {
            this.data = state;
            this.success = success;
            this.message = Message;
        }

        public bool success { get; set; }
        public T data { get; set; }
        private string Message;
        public string message
        {
            get { return !success && string.IsNullOrEmpty(Message) ? "Something went wrong. Please contact administrator!" : Message; }
            set { Message = value; }
        }
    }

    public class Result
    {
        public Result() { }

        public Result(bool success)
            : this(success, null)
        { }

        public Result(bool success, string Message)
        {
            this.success = success;
            this.Message = Message;
        }

        public bool success { get; private set; }
        public string Message { get; private set; }
    }
}

USE [Pay2Me_dev]
GO
/****** Object:  StoredProcedure [dbo].[Transactions_AcceptRejectRequest]    Script Date: 27-11-2025 11:28:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Yash Bhalodiya
-- Create date: 07-05-2024
-- Description:	<Description,,>
-- EXEC Beneficiary_AcceptRejectRequest '8866459225'
-- =============================================
ALTER PROCEDURE [dbo].[Transactions_AcceptRejectRequest]
	-- Add the parameters for the stored procedure here
	@JsonData NVARCHAR(MAX),
	@LogInUserId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	DECLARE @StatusId INT,
			@Remarks VARCHAR(MAX),
			@TransactionId VARCHAR(15),
			@ReferenceId VARCHAR(6),
			@Id INT,
			@UserId INT = 0,
			@Amount MONEY = 0,
			@Balance MONEY = 0,
			@RoleId INT = 0,
			@AssignParty INT = 0,
			@PartyBal MONEY = 0;

	SET @RoleId = (SELECT RoleId FROM Users WITH (NOLOCK) WHERE Id = @LogInUserId);

	IF(@RoleId = 2)
	BEGIN
		Select TOP 1 'Access denied.' AS FLAG, 
					   0 AS Success
	END
	ELSE
	BEGIN
		SELECT DISTINCT TOP 1
					@StatusId = JSON_VALUE(@JsonData, '$.StatusId'),
					@Remarks = JSON_VALUE(@JsonData, '$.Remarks'),
					@TransactionId = JSON_VALUE(@JsonData, '$.TransactionId'),
					@Id = JSON_VALUE(@JsonData, '$.Id'),
					@AssignParty = JSON_VALUE(@JsonData, '$.AssignParty')
			FROM OPENJSON(@JsonData)

		IF Exists(
					Select Top 1 1 
						From Transactions WITH (NOLOCK) 
						Where Id = @Id
							AND TransactionId = @TransactionId)
		BEGIN

				UPDATE Transactions
					SET PaymentStatusId = @StatusId,
						Remarks = @Remarks,
						RequestRead = 1
					WHERE TransactionId = @TransactionId
						AND Id = @Id

				IF(@StatusId = 2)
				BEGIN

					SET @PartyBal = (SELECT TOP 1 Balance FROM Users WHERE Id = @AssignParty)

					UPDATE Transactions
					SET --Descriptions = CONCAT('Amount transfer to ', (SELECT TOP 1 Username FROM Users WHERE Id = @AssignParty)),
						@Amount = DAmount,
						AssignParty = @AssignParty
					WHERE TransactionId = @TransactionId
						AND Id = @Id

					(SELECT @UserId = UserId FROM Transactions WHERE TransactionId = @TransactionId AND Id = @Id);
						
					INSERT INTO Transactions(TTypeId, TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, CreatedDate, RequestRead, Descriptions)
					SELECT TOP 1
						4,
						@TransactionId,
						t.ReferenceId,
						@AssignParty,
						2,
						2,
						t.DAmount,
						0,
						(@PartyBal + t.DAmount),
						GETUTCDATE(),
						1,
						'' --CONCAT('Received amount from ', (SELECT TOP 1 Username FROM Users WHERE Id = @UserId))
					FROM Transactions T
					WHERE t.TransactionId = @TransactionId
						AND t.Id = @Id

					UPDATE Users
					SET Balance = (@PartyBal + @Amount)
					WHERE Id = @AssignParty

						Select TOP 1 'Request accept successfully.' AS FLAG, 
							1 AS Success
				END
				ELSE IF(@StatusId = 6)
				BEGIN

					UPDATE Transactions
					SET AssignParty = @AssignParty
					WHERE TransactionId = @TransactionId
						AND Id = @Id

					Select TOP 1 'Request transfer to in-process successfully.' AS FLAG, 
							1 AS Success
				END
				ELSE
				BEGIN

						(SELECT @UserId = UserId, @Amount = DAmount, @ReferenceId = ReferenceId
							FROM Transactions WHERE TransactionId = @TransactionId AND Id = @Id);

						SET @PartyBal = (SELECT TOP 1 Balance FROM Users WHERE Id = @AssignParty)

						IF(@UserId <> 0)
						BEGIN

							UPDATE Users
									SET Balance = (Balance + @Amount)
								WHERE Id = @UserId
						
							SET @Balance = (SELECT Balance FROM Users WHERE Id = @UserId)

							IF(ISNULL(@AssignParty, 0) <> 0)
							BEGIN
								--user entry
								INSERT INTO Transactions(TTypeId, TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, CreatedDate, Remarks, Descriptions, AssignParty)
								VALUES (4, @TransactionId, @ReferenceId, @UserId, 3, 2, @Amount, 0, @Balance, GETUTCDATE(), @Remarks, '', @AssignParty)--CONCAT('Refund credited from ', (SELECT TOP 1 Username FROM Users WHERE Id = @AssignParty)), @AssignParty)
								
								IF EXISTS(SELECT TOP 1 1 FROM Transactions WHERE TransactionId = @TransactionId AND PaymentStatusId = 2)
								BEGIN
									-- party entry
									INSERT INTO Transactions(TTypeId, TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, CreatedDate, Remarks, Descriptions)
									VALUES (4, @TransactionId, @ReferenceId, @AssignParty, 3, 2, 0, @Amount, (@PartyBal - @Amount), GETUTCDATE(), @Remarks, '')--CONCAT('Refund deducted for ', (SELECT TOP 1 Username FROM Users WHERE Id = @UserId)))

									UPDATE Users
									SET Balance = (@PartyBal - @Amount)
									WHERE Id = @AssignParty
								END
							END
							ELSE
							BEGIN
								--user entry if not assign the party
								INSERT INTO Transactions(TTypeId, TransactionId, ReferenceId, UserId, PaymentStatusId, TransactionStatuId, CAmount, DAmount, Closing, CreatedDate, Remarks, Descriptions, AssignParty)
								VALUES (4, @TransactionId, @ReferenceId, @UserId, 3, 2, @Amount, 0, @Balance, GETUTCDATE(), @Remarks, '', 0)
							END
							--INSERT INTO TransactionLogs(TransactionId, AccountId, UserId, BankName, AccountNo, AccountHolderName, IFSCCode)
							--SELECT SCOPE_IDENTITY(), b.AccountId, b.UserId, b.BankName, b.AccountNo, b.AccountHolderName, b.IFSCCode FROM Beneficiary b WHERE b.Id = @BeneficiaryId

							Select TOP 1 'Request reject successfully.' AS FLAG, 
							1 AS Success
						END
						ELSE
						BEGIN
							Select TOP 1 'User not found.' AS FLAG, 
							0 AS Success
						END
				END
	
		END
		ELSE
		BEGIN
				Select TOP 1 'Request not found.!' AS FLAG, 
						   0 AS Success
		END
	END
END

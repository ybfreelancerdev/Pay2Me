CREATE TABLE [dbo].[Parties] (
    [Id]        INT           IDENTITY (1, 1) NOT NULL,
    [UserId]    INT           NOT NULL,
    [PartyCode] NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Parties] PRIMARY KEY CLUSTERED ([Id] ASC)
);


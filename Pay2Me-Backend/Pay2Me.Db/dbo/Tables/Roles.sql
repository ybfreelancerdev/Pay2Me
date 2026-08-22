CREATE TABLE [dbo].[Roles] (
    [Id]   INT          IDENTITY (1, 1) NOT NULL,
    [Role] VARCHAR (50) NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED ([Id] ASC)
);


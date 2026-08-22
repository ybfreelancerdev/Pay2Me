CREATE TABLE [dbo].[Settings] (
    [Id]       INT           IDENTITY (1, 1) NOT NULL,
    [KeyName]  VARCHAR (50)  NOT NULL,
    [KeyValue] VARCHAR (MAX) NOT NULL,
    [IsEnable] BIT           NOT NULL,
    CONSTRAINT [PK_Settings] PRIMARY KEY CLUSTERED ([Id] ASC)
);


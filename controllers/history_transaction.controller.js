const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    createHistoryTransaction: async (req, res, next) => {
        try {
            const { tanggal_waktu, checkoutId } = req.body;

            const newHistoryTransaction = await prisma.history_Transaction.create({
                data: {
                    tanggal_waktu,
                    checkout: { connect: { id: checkoutId } },
                },
            });

            res.status(201).json({
                status: true,
                message: 'History Transaction created successfully',
                data: newHistoryTransaction,
            });
        } catch (error) {
            next(error);
        }
    },

    listHistoryTransactions: async (req, res, next) => {
        try {
            const historyTransactions = await prisma.history_Transaction.findMany({
                include: { checkout: true },
            });

            res.status(200).json({
                status: true,
                message: 'History Transactions retrieved successfully',
                data: historyTransactions,
            });
        } catch (error) {
            next(error);
        }
    },

    getHistoryTransaction: async (req, res, next) => {
        const historyTransactionId = Number(req.params.id);

        try {
            const historyTransaction = await prisma.history_Transaction.findUnique({
                where: { id: historyTransactionId },
                include: { checkout: true },
            });

            if (!historyTransaction) {
                return res.status(404).json({
                    status: false,
                    message: "History Transaction not found",
                    data: null,
                });
            }

            res.status(200).json({
                status: true,
                message: 'History Transaction retrieved successfully',
                data: historyTransaction,
            });
        } catch (error) {
            next(error);
        }
    },

    updateHistoryTransaction: async (req, res, next) => {
        const historyTransactionId = Number(req.params.id);
        const { tanggal_waktu, checkoutId } = req.body;

        try {
            const updatedHistoryTransaction = await prisma.history_Transaction.update({
                where: { id: historyTransactionId },
                data: {
                    tanggal_waktu,
                    checkout: { connect: { id: checkoutId } },
                },
            });

            res.status(200).json({
                status: true,
                message: 'History Transaction updated successfully',
                data: updatedHistoryTransaction,
            });
        } catch (error) {
            next(error);
        }
    },

    deleteHistoryTransaction: async (req, res, next) => {
        const historyTransactionId = Number(req.params.id);

        try {
            await prisma.history_Transaction.delete({
                where: { id: historyTransactionId },
            });

            res.status(200).json({
                status: true,
                message: 'History Transaction deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    },
};

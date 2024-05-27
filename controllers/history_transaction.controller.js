const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const createHistoryTransaction = async (req, res, next) => {
    try {
        const { tanggal_waktu, checkoutId } = req.body;

        if (!tanggal_waktu || !checkoutId) {
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            });
        }

        const newHistoryTransaction = await prisma.history_Transaction.create({
            data: {
                tanggal_waktu,
                checkout: { connect: { id: checkoutId } }
            }
        });

        return res.status(201).json({
            status: true,
            message: "History Transaction created successfully",
            data: newHistoryTransaction
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const listHistoryTransactions = async (req, res, next) => {
    try {
        const historyTransactions = await prisma.history_Transaction.findMany({
            include: { checkout: true }
        });

        return res.status(200).json({
            status: true,
            message: "History Transactions retrieved successfully",
            data: historyTransactions
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getHistoryTransaction = async (req, res, next) => {
    const historyTransactionId = Number(req.params.id);

    try {
        const historyTransaction = await prisma.history_Transaction.findUnique({
            where: { id: historyTransactionId },
            include: { checkout: true }
        });

        if (!historyTransaction) {
            return res.status(404).json({
                status: false,
                message: "History Transaction not found",
                data: null
            });
        }

        return res.status(200).json({
            status: true,
            message: "History Transaction retrieved successfully",
            data: historyTransaction
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const updateHistoryTransaction = async (req, res, next) => {
    const historyTransactionId = Number(req.params.id);
    const { tanggal_waktu, checkoutId } = req.body;

    try {
        const updatedHistoryTransaction = await prisma.history_Transaction.update({
            where: { id: historyTransactionId },
            data: {
                tanggal_waktu,
                checkout: { connect: { id: checkoutId } }
            }
        });

        return res.status(200).json({
            status: true,
            message: "History Transaction updated successfully",
            data: updatedHistoryTransaction
        });
    } catch (error) {
        next(error);
    }
};

const deleteHistoryTransaction = async (req, res, next) => {
    const historyTransactionId = Number(req.params.id);

    try {
        await prisma.history_Transaction.delete({
            where: { id: historyTransactionId }
        });

        return res.status(200).json({
            status: true,
            message: "History Transaction deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createHistoryTransaction,
    listHistoryTransactions,
    getHistoryTransaction,
    updateHistoryTransaction,
    deleteHistoryTransaction
};

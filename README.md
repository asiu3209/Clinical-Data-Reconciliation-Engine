# Clinical-Data-Reconciliation-Engine

## Overview
Healthcare data for the same patient is often stored across multiple systems such as hospitals, clinics, pharmacies, and patient portals. Because these systems are not always synchronized, they may contain **conflicting information**, making it difficult for healthcare providers to determine the correct patient record.

This project builds a **mini clinical data reconciliation engine** that analyzes conflicting records and uses AI-based reasoning to determine the **most likely accurate information**.

## Problem Example
Different systems may report different information for the same patient:

- Hospital System: Aspirin 81mg daily  
- Clinic System: Aspirin 325mg daily  
- Pharmacy Records: Aspirin 81mg filled 2 days ago  
- Patient Portal: Not currently taking aspirin  

These inconsistencies can create uncertainty and increase the risk of medical errors.

## Goal
The goal of this project is to create a system that:

- Collects patient data from multiple sources  
- Detects conflicting information  
- Uses AI to evaluate which data is most reliable  
- Produces a reconciled patient record with the most probable correct information

## Outcome
The system demonstrates how healthcare platforms can **resolve conflicting data and improve the reliability of patient information across systems**.
